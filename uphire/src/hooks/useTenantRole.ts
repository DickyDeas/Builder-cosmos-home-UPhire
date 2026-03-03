/**
 * Hook to get current user's role in a tenant for RBAC.
 * Returns role and whether user can write (create/update/delete).
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TenantRole = "owner" | "admin" | "recruiter" | "hiring_manager" | "interviewer" | "viewer" | "member";

const WRITE_ROLES: TenantRole[] = ["owner", "admin", "recruiter", "hiring_manager", "interviewer"];

export interface TenantMembership {
  tenantId: string;
  role: TenantRole;
  canWrite: boolean;
}

export function useTenantRole(tenantId: string | null | undefined) {
  const [membership, setMembership] = useState<TenantMembership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setMembership(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data, error } = await supabase
        .from("tenant_users")
        .select("tenant_id, role")
        .eq("tenant_id", tenantId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        setMembership(null);
        setLoading(false);
        return;
      }

      const role = (data?.role || "member") as TenantRole;
      setMembership({
        tenantId,
        role,
        canWrite: WRITE_ROLES.includes(role),
      });
      setLoading(false);
    }

    fetchRole();
    return () => { cancelled = true; };
  }, [tenantId]);

  return { membership, loading, canWrite: membership?.canWrite ?? false, role: membership?.role };
}
