/**
 * Role flags service - fetches struggling roles and roles needing attention.
 * Used for admin dashboards, notifications, and role health indicators.
 */

export interface StrugglingRole {
  id: string;
  title?: string;
  [key: string]: unknown;
}

export interface RoleNeedingAttention {
  role_id: string;
  role_title: string;
  tenant_id?: string;
  tenant_name?: string;
  days_open: number;
  candidate_count: number;
  created_at?: string;
}

/**
 * Fetch roles that are struggling (manually flagged in role_flags).
 * Requires get_struggling_roles RPC in Supabase.
 */
export async function fetchStrugglingRoles(): Promise<StrugglingRole[]> {
  try {
    const res = await fetch("/api/role-flags-check");
    const data = await res.json();
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || "Failed to fetch role flags");
    }
    return (data as { roles?: StrugglingRole[] }).roles ?? [];
  } catch (err) {
    console.error("Role flags fetch error:", err);
    return [];
  }
}

/**
 * Fetch roles with no applicants after 5-7 days (auto-detected).
 * Use for notifications to assign outside resources to build shortlist.
 * Staff only – pass accessToken from session for authenticated request.
 */
export async function fetchRolesNeedingAttention(days = 5, accessToken?: string): Promise<RoleNeedingAttention[]> {
  try {
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const res = await fetch(`/api/roles-needing-attention?days=${days}`, { headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || "Failed to fetch roles needing attention");
    }
    return (data as { roles?: RoleNeedingAttention[] }).roles ?? [];
  } catch (err) {
    console.error("Roles needing attention fetch error:", err);
    return [];
  }
}
