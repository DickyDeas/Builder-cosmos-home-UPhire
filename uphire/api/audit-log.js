/**
 * Netlify serverless function: Write audit log entry (server-side, bypasses RLS).
 * POST /api/audit-log
 *
 * Body: { tenantId?, userId?, action, resourceType?, resourceId?, metadata? }
 *
 * Requires: Supabase service role (server-side only).
 */

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfigured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { tenantId, userId, action, resourceType, resourceId, metadata } = body;
  if (!action || typeof action !== "string") {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing action" }),
    };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceKey);

  const ip = event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || event.headers?.["x-real-ip"];
  const userAgent = event.headers?.["user-agent"];

  const { error } = await supabase.from("audit_logs").insert({
    tenant_id: tenantId || null,
    user_id: userId || null,
    action,
    resource_type: resourceType || null,
    resource_id: resourceId || null,
    metadata: metadata || null,
    ip_address: ip || null,
    user_agent: userAgent || null,
  });

  if (error) {
    console.error("Audit log insert error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to write audit log" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ success: true }),
  };
}
