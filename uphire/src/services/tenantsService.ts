/**
 * Tenants service - fetch user's tenants, create tenant
 */

import { supabase } from "@/lib/supabaseClient";

export interface Tenant {
  id: string;
  name: string;
  slug: string | null;
  created_at?: string;
}

export async function fetchUserTenants(): Promise<Tenant[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: memberships } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id);

  if (!memberships?.length) return [];

  const ids = memberships.map((m) => m.tenant_id);
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, name, slug, created_at")
    .in("id", ids)
    .order("name");

  return (tenants || []) as Tenant[];
}

export interface AdminTenant extends Tenant {
  role_count?: number;
  user_count?: number;
  /** Billing plan – populated when tenant_billing schema exists */
  billing_plan?: string;
  /** Missed payments count – populated when tenant_billing schema exists */
  missed_payments?: number;
  /** Usage (e.g. roles used / limit) – populated when tenant_usage schema exists */
  usage?: string;
  /** Overspend flag – populated when tenant_billing schema exists */
  overspend?: boolean;
  /** Analytics summary – populated when tenant analytics exist */
  analytics_summary?: string;
}

/**
 * Fetch all tenants (UPhire staff only).
 * Requires staff privileges (is_uphire_staff or UPHIRE_STAFF_EMAILS).
 */
export async function fetchAllTenantsForStaff(): Promise<AdminTenant[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return [];

  try {
    const res = await fetch("/api/admin-tenants", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) return [];
      throw new Error((data as { error?: string }).error || "Failed to fetch tenants");
    }
    return (data as { tenants?: AdminTenant[] }).tenants ?? [];
  } catch (err) {
    console.error("Admin tenants fetch error:", err);
    return [];
  }
}

export async function createTenant(name: string): Promise<Tenant | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data: tenant, error } = await supabase
    .from("tenants")
    .insert({ name, slug })
    .select("id, name, slug, created_at")
    .single();

  if (error) return null;

  await supabase.from("tenant_users").insert({
    tenant_id: tenant.id,
    user_id: user.id,
    role: "owner",
  });

  return tenant as Tenant;
}
