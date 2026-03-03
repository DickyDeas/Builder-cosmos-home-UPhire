/**
 * Netlify serverless function: Post job to job board using tenant credentials
 * POST /api/job-board-post
 *
 * Body: { tenantId, boardType, job }
 * Uses tenant_job_board_licenses (board_type, status, metadata) and connector registry.
 */

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured" }) };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceKey);

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { tenantId, boardType, job } = body;
  if (!tenantId || !boardType || !job) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing tenantId, boardType, or job" }),
    };
  }

  const { data: license, error: licenseError } = await supabase
    .from("tenant_job_board_licenses")
    .select("id, metadata, board_type")
    .eq("tenant_id", tenantId)
    .eq("board_type", boardType)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (licenseError || !license) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "No active license for this board type" }),
    };
  }

  const metadata = license.metadata || {};
  const credentials = {
    accessToken: metadata.access_token,
    refreshToken: metadata.refresh_token,
    apiKey: metadata.api_key,
    username: metadata.username,
    expiresAt: metadata.expires_at,
  };

  if (!credentials.accessToken && !credentials.apiKey && !credentials.username) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "No credentials configured for this board" }),
    };
  }

  // Connector abstraction: resolve by board_type (linkedin, indeed, broadbean, etc.)
  // Placeholder - actual connectors would be imported and invoked here
  const jobPost = {
    title: job.title || "Untitled",
    description: job.description,
    location: job.location,
    salary: job.salary,
    employmentType: job.employmentType,
    ...job,
  };

  // TODO: getConnector(boardType).postJob(credentials, jobPost)
  // For now return success (integration pending)
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      message: "Job posted (connector integration pending)",
      boardType,
    }),
  };
}
