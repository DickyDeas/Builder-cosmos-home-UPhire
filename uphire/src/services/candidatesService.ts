/**
 * Candidates service - CRUD with audit logging
 */

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/services/auditService";

export interface InsertCandidatePayload {
  role_id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  status?: string;
}

export interface UpdateCandidatePayload {
  name?: string;
  email?: string;
  phone?: string | null;
  status?: string;
}

export async function insertCandidate(payload: InsertCandidatePayload) {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;

  const insertPayload = {
    role_id: payload.role_id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    status: payload.status ?? "new",
  };

  const { data, error } = await supabase
    .from("candidates")
    .insert(insertPayload)
    .select("id, name, email, phone, status, created_at, tenant_id")
    .single();

  if (error) throw error;

  if (profileId && data) {
    logAudit({
      tenantId: (data as { tenant_id?: string }).tenant_id,
      userId: profileId,
      action: "candidate_create",
      resourceType: "candidate",
      resourceId: String(data.id),
      metadata: { name: data.name, roleId: payload.role_id },
    });
  }

  return data;
}

export async function updateCandidate(id: string | number, payload: UpdateCandidatePayload) {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;

  const { error } = await supabase.from("candidates").update(payload).eq("id", id);

  if (error) throw error;

  if (profileId) {
    logAudit({
      userId: profileId,
      action: "candidate_update",
      resourceType: "candidate",
      resourceId: String(id),
      metadata: { name: payload.name, status: payload.status },
    });
  }
}

export async function deleteCandidate(id: string | number) {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;

  // Soft-delete (GDPR Right to Erasure)
  const { error } = await supabase
    .from("candidates")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: profileId ?? null,
    })
    .eq("id", id);

  if (error) throw error;

  if (profileId) {
    logAudit({
      userId: profileId,
      action: "candidate_delete",
      resourceType: "candidate",
      resourceId: String(id),
    });
  }
}
