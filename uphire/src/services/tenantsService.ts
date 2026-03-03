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
