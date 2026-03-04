/**
 * Job board service - posts jobs to external boards via /api/job-board-post.
 * Uses boardType (linkedin, indeed, broadbean, etc.) and tenant credentials.
 */

import { encryptMetadata } from "@/lib/encryptMetadata";

export interface JobPostPayload {
  title: string;
  description?: string;
  location?: string;
  salary?: string;
  employmentType?: string;
  [key: string]: unknown;
}

export interface PostJobResult {
  success: boolean;
  message?: string;
  boardType?: string;
  error?: string;
}

/**
 * Post a job to a tenant's connected job board.
 */
export async function postJobToBoard(
  tenantId: string,
  boardType: string,
  job: JobPostPayload
): Promise<PostJobResult> {
  try {
    const res = await fetch("/api/job-board-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId,
        boardType,
        job,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data?.error || "Job post failed" };
    }
    return {
      success: data.success ?? true,
      message: data.message,
      boardType: data.boardType,
    };
  } catch (err) {
    console.error("Job board post error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Encrypt credentials before storing in tenant_job_board_licenses.metadata.
 * Requires ENCRYPTION_KEY (hex) server-side. Use when saving OAuth tokens or API keys.
 */
export async function encryptCredentialsForStorage(
  credentials: Record<string, unknown>,
  encryptionKeyHex: string
): Promise<string> {
  return encryptMetadata(credentials, encryptionKeyHex);
}
