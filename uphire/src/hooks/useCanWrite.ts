/**
 * Hook to check if current user can write (create/update/delete).
 * Solo users (no tenants) can always write. Tenant members need owner/admin/recruiter/hiring_manager/interviewer.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const WRITE_ROLES = ["owner", "admin", "recruiter", "hiring_manager", "interviewer"];

export function useCanWrite(): { canWrite: boolean; loading: boolean } {
  const [canWrite, setCanWrite] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) {
        setCanWrite(false);
        setLoading(false);
        return;
      }

      const { data: memberships } = await supabase
        .from("tenant_users")
        .select("role")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (!memberships?.length) {
        setCanWrite(true);
        setLoading(false);
        return;
      }

      const hasWrite = memberships.some((m) => WRITE_ROLES.includes(m.role || ""));
      setCanWrite(hasWrite);
      setLoading(false);
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return { canWrite, loading };
}
