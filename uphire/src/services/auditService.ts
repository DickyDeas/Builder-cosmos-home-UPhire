/**
 * Audit logging service for enterprise compliance (SOC 2, GDPR).
 * Writes via /api/audit-log (server-side) to bypass RLS and ensure logs are persisted.
 */

export type AuditAction =
  | "login"
  | "logout"
  | "role_create"
  | "role_update"
  | "role_delete"
  | "candidate_create"
  | "candidate_update"
  | "candidate_delete"
  | "employee_create"
  | "employee_update"
  | "employee_delete"
  | "document_create"
  | "document_update"
  | "document_delete"
  | "tenant_user_invite"
  | "tenant_user_remove"
  | "settings_change"
  | "integration_connect"
  | "integration_disconnect"
  | "data_export"
  | "other";

export interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an audit event via server-side API (bypasses RLS, ensures persistence).
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const res = await fetch("/api/audit-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: entry.tenantId,
        userId: entry.userId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        metadata: entry.metadata,
      }),
    });
    if (!res.ok) {
      console.warn("Audit log failed:", res.status);
    }
  } catch (err) {
    console.warn("Audit log error:", err);
  }
}
