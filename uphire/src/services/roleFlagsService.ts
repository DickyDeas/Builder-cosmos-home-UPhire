/**
 * Role flags service - fetches struggling roles from /api/role-flags-check.
 * Used for admin dashboards, cron jobs, or role health indicators.
 */

export interface StrugglingRole {
  id: string;
  title?: string;
  [key: string]: unknown;
}

/**
 * Fetch roles that are struggling (e.g. low applications, stale).
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
