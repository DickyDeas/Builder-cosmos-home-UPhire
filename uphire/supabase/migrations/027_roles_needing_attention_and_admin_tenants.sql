-- 027_roles_needing_attention_and_admin_tenants.sql
-- 1. Auto-detect roles with no applicants after 5-7 days (for outside resource / shortlist building)
-- 2. Support admin view of all tenants

-- Function: Get roles with 0 applicants that have been open 5+ days
-- Returns role details for notifications / admin dashboard
CREATE OR REPLACE FUNCTION get_roles_needing_attention(min_days INTEGER DEFAULT 5)
RETURNS TABLE (
  role_id TEXT,
  role_title TEXT,
  tenant_id UUID,
  tenant_name TEXT,
  days_open INTEGER,
  candidate_count BIGINT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id::TEXT AS role_id,
    r.title AS role_title,
    r.tenant_id AS tenant_id,
    t.name AS tenant_name,
    EXTRACT(DAY FROM (NOW() - r.created_at))::INTEGER AS days_open,
    COALESCE(c.cnt, 0)::BIGINT AS candidate_count,
    r.created_at AS created_at
  FROM roles r
  LEFT JOIN tenants t ON t.id = r.tenant_id
  LEFT JOIN (
    SELECT role_id, COUNT(*) AS cnt
    FROM candidates
    WHERE deleted_at IS NULL
    GROUP BY role_id
  ) c ON c.role_id::text = r.id::text
  WHERE
    (r.status = 'Active' OR r.status IS NULL OR r.status NOT IN ('Closed', 'Draft'))
    AND COALESCE(c.cnt, 0) = 0
    AND r.created_at <= NOW() - (min_days || ' days')::INTERVAL
  ORDER BY r.created_at ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Function: Get all tenants (UPhire staff only) for admin dashboard
CREATE OR REPLACE FUNCTION get_all_tenants_for_staff()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ,
  role_count BIGINT,
  user_count BIGINT
) AS $$
BEGIN
  IF NOT (SELECT is_uphire_staff()) THEN
    RAISE EXCEPTION 'Access denied: staff only';
  END IF;
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.slug,
    t.created_at,
    (SELECT COUNT(*) FROM roles r WHERE r.tenant_id = t.id)::BIGINT AS role_count,
    (SELECT COUNT(*) FROM tenant_users tu WHERE tu.tenant_id = t.id)::BIGINT AS user_count
  FROM tenants t
  ORDER BY t.name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;
