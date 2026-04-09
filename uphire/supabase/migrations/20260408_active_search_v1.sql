-- Active Search V1 schema scaffold
-- Safe to run in an empty project; adapt for existing production migrations.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'role_status') then
    create type role_status as enum ('draft', 'active', 'paused', 'closed', 'filled');
  end if;
  if not exists (select 1 from pg_type where typname = 'role_health_state') then
    create type role_health_state as enum ('healthy', 'weak_pipeline', 'at_risk', 'stale', 'paused', 'escalated');
  end if;
  if not exists (select 1 from pg_type where typname = 'role_candidate_stage') then
    create type role_candidate_stage as enum ('new', 'screening', 'qualified', 'borderline', 'rejected', 'shortlisted', 'interviewing');
  end if;
  if not exists (select 1 from pg_type where typname = 'knockout_status_type') then
    create type knockout_status_type as enum ('pending', 'pass', 'fail');
  end if;
  if not exists (select 1 from pg_type where typname = 'shortlist_bucket_type') then
    create type shortlist_bucket_type as enum ('qualified', 'borderline', 'rejected');
  end if;
end $$;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  title text not null,
  location text,
  salary_min numeric,
  salary_max numeric,
  contract_type text,
  shift_pattern text,
  urgency text,
  status role_status not null default 'draft',
  health_state role_health_state not null default 'healthy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists job_specs (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references roles(id) on delete cascade,
  structured_spec_json jsonb not null default '{}'::jsonb,
  jd_text text not null default '',
  screening_questions_json jsonb not null default '[]'::jsonb,
  knockout_rules_json jsonb not null default '[]'::jsonb,
  sourcing_strategy_json jsonb not null default '{}'::jsonb,
  outreach_strategy_json jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  full_name text not null,
  email text,
  phone text,
  location text,
  parsed_profile_json jsonb not null default '{}'::jsonb,
  source_type text not null,
  source_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_candidates_source_unique
  on candidates(source_type, source_ref)
  where source_ref is not null;

create table if not exists role_candidates (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references roles(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  source_channel text not null,
  stage role_candidate_stage not null default 'new',
  fit_score numeric not null default 0,
  knockout_status knockout_status_type not null default 'pending',
  shortlist_status shortlist_bucket_type,
  identity_fingerprint text not null,
  outreach_attempts integer not null default 0,
  outreach_opt_out boolean not null default false,
  last_outreach_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(role_id, candidate_id),
  unique(role_id, identity_fingerprint)
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  role_candidate_id uuid not null references role_candidates(id) on delete cascade,
  channel text not null,
  direction text not null check (direction in ('outbound', 'inbound')),
  message_text text not null,
  provider_message_id text,
  delivered_at timestamptz,
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists screening_results (
  id uuid primary key default gen_random_uuid(),
  role_candidate_id uuid not null references role_candidates(id) on delete cascade,
  answers_json jsonb not null default '{}'::jsonb,
  screening_summary text not null default '',
  confidence_score numeric not null default 0,
  fit_score numeric not null default 0,
  knockout_status knockout_status_type not null default 'pending',
  rationale text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists shortlist_entries (
  id uuid primary key default gen_random_uuid(),
  role_candidate_id uuid not null references role_candidates(id) on delete cascade,
  rank integer not null,
  shortlist_bucket shortlist_bucket_type not null,
  explanation text not null default '',
  approved_by_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(role_candidate_id)
);

create table if not exists role_health_events (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references roles(id) on delete cascade,
  previous_state role_health_state not null,
  new_state role_health_state not null,
  trigger_reason text not null default '',
  metrics_snapshot_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_id text,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists source_capabilities (
  id uuid primary key default gen_random_uuid(),
  source_name text not null unique,
  can_search_profiles boolean not null default false,
  can_import_profiles boolean not null default false,
  can_message_candidates boolean not null default false,
  can_sync_responses boolean not null default false,
  can_view_contact_details boolean not null default false,
  rate_limit_json jsonb not null default '{}'::jsonb,
  policy_json jsonb not null default '{}'::jsonb,
  active boolean not null default true
);

create table if not exists role_orchestrator_configs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  role_id uuid references roles(id) on delete cascade,
  rules_json jsonb not null default '{}'::jsonb,
  mode text not null default 'semi_automated',
  paused boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists idx_role_orchestrator_configs_role_unique
  on role_orchestrator_configs(role_id)
  where role_id is not null;

create index if not exists idx_role_candidates_role_updated on role_candidates(role_id, updated_at desc);
create index if not exists idx_role_candidates_role_fit on role_candidates(role_id, fit_score desc);
create index if not exists idx_screening_results_role_candidate_created on screening_results(role_candidate_id, created_at desc);
create index if not exists idx_conversations_role_candidate_created on conversations(role_candidate_id, created_at desc);
create index if not exists idx_role_health_events_role_created on role_health_events(role_id, created_at desc);
create index if not exists idx_roles_client_status on roles(client_id, status);
create index if not exists idx_conversations_role_candidate_direction
  on conversations(role_candidate_id, direction, created_at desc);
create index if not exists idx_shortlist_entries_role_candidate on shortlist_entries(role_candidate_id);

-- RLS skeleton (must be integrated with tenant/client membership model)
alter table roles enable row level security;
alter table job_specs enable row level security;
alter table candidates enable row level security;
alter table role_candidates enable row level security;
alter table conversations enable row level security;
alter table screening_results enable row level security;
alter table shortlist_entries enable row level security;
alter table role_health_events enable row level security;
alter table audit_events enable row level security;
alter table role_orchestrator_configs enable row level security;

-- Replace this policy with your existing tenant membership function/table checks.
drop policy if exists roles_select_placeholder on roles;
create policy roles_select_placeholder on roles
  for select using (auth.role() = 'authenticated');
