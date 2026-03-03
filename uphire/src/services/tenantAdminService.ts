/**
 * Tenant admin service - invite users, manage tenant membership.
 * For delegated tenant administration.
 */

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/services/auditService";

export type TenantRole = "owner" | "admin" | "recruiter" | "hiring_manager" | "interviewer" | "viewer";

export interface InviteUserPayload {
  tenantId: string;
  email: string;
  role: TenantRole;
}

/**
 * Invite a user to a tenant. Creates tenant_users row.
 * Caller must be owner or admin. RLS enforces this.
 */
export async function inviteUserToTenant(payload: InviteUserPayload): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  const userId = profile?.id;
  if (!userId) {
    return { success: false, error: "User not found. They must sign up first." };
  }

  const { error } = await supabase.from("tenant_users").insert({
    tenant_id: payload.tenantId,
    user_id: userId,
    role: payload.role,
  });

  if (error) {
    if (error.code === "23505") return { success: false, error: "User is already in this tenant" };
    return { success: false, error: error.message };
  }

  logAudit({
    tenantId: payload.tenantId,
    userId: user.id,
    action: "tenant_user_invite",
    resourceType: "tenant_user",
    resourceId: userId,
    metadata: { email: payload.email, role: payload.role },
  });

  return { success: true };
}

/**
 * Remove a user from a tenant.
 */
export async function removeUserFromTenant(
  tenantId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("tenant_users")
    .delete()
    .eq("tenant_id", tenantId)
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };

  logAudit({
    tenantId,
    userId: user.id,
    action: "tenant_user_remove",
    resourceType: "tenant_user",
    resourceId: userId,
  });

  return { success: true };
}
