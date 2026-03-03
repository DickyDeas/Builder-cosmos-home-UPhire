/**
 * GDPR Right to Access & Erasure – Export and purge candidate data
 */

import { supabase } from "@/lib/supabaseClient";

export async function exportCandidateData(candidateId?: string, email?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch("/api/export-candidate-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId, email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Export failed");
  return data;
}

export async function purgeCandidateData(candidateId?: string, email?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch("/api/purge-candidate-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId, email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Purge failed");
  return data;
}
