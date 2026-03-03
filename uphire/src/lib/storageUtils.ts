/**
 * Storage path utilities for tenant-isolated file storage.
 * Use tenants/{tenant_id}/... prefix for RLS compliance (migration 017).
 */

export type StorageBucket = "documents" | "cv-uploads" | "company-assets";

/**
 * Build a tenant-scoped storage path for RLS.
 * Format: tenants/{tenantId}/{bucketSuffix}/{filename}
 */
export function tenantStoragePath(
  tenantId: string,
  bucket: StorageBucket,
  filename: string,
  subfolder?: string
): string {
  const suffix = bucket === "documents" ? "documents" : bucket === "cv-uploads" ? "cv-uploads" : "company-assets";
  const parts = ["tenants", tenantId, suffix];
  if (subfolder) parts.push(subfolder);
  parts.push(filename);
  return parts.join("/");
}

/**
 * Build path for documents bucket (contracts, handbooks, etc.)
 */
export function documentPath(tenantId: string, filename: string, subfolder?: string): string {
  return tenantStoragePath(tenantId, "documents", filename, subfolder);
}

/**
 * Build path for CV uploads bucket
 */
export function cvUploadPath(tenantId: string, filename: string, candidateId?: string): string {
  const subfolder = candidateId ? `candidate-${candidateId}` : undefined;
  return tenantStoragePath(tenantId, "cv-uploads", filename, subfolder);
}
