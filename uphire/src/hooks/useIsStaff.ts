/**
 * Hook to check if the current user is UPhire staff (admin).
 * Used to show/hide All Clients tab and admin-only alerts.
 * Checks: 1) /api/is-staff (UPHIRE_STAFF_EMAILS), 2) profile.subscription_plan === 'enterprise'
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useIsStaff(): boolean | null {
  const [isStaff, setIsStaff] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setIsStaff(false);
        return;
      }
      try {
        const res = await fetch("/api/is-staff", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        const apiStaff = !!(data as { isStaff?: boolean }).isStaff;
        if (apiStaff) {
          setIsStaff(true);
          return;
        }
        // Fallback: profile.subscription_plan === 'enterprise' (matches is_uphire_staff() in DB)
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_plan")
          .eq("id", session.user.id)
          .single();
        setIsStaff(profile?.subscription_plan === "enterprise");
      } catch {
        // Fallback on API failure
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_plan")
            .eq("id", session.user.id)
            .single();
          setIsStaff(profile?.subscription_plan === "enterprise");
        } else {
          setIsStaff(false);
        }
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    return () => subscription.unsubscribe();
  }, []);

  return isStaff;
}
