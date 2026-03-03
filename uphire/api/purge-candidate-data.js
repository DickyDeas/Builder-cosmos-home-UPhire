/**
 * GDPR Right to Erasure – Purge candidate data (hard delete after soft-delete).
 * POST /api/purge-candidate-data
 *
 * Body: { candidateId } or { email }
 * Requires: Supabase service role. Caller must own the role/candidate.
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

  const authHeader = event.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Authorization required" }),
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

  const { candidateId, email } = body;
  if (!candidateId && !email) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Provide candidateId or email" }),
    };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceKey);

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }

  let query = supabase.from("candidates").select("id, role_id");
  if (candidateId) query = query.eq("id", candidateId);
  else query = query.eq("email", email);

  const { data: candidates, error } = await query;

  if (error || !candidates?.length) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Candidate not found" }),
    };
  }

  const candidate = candidates[0];
  const { data: role } = await supabase
    .from("roles")
    .select("id, profile_id, tenant_id")
    .eq("id", candidate.role_id)
    .single();

  const isOwner = role?.profile_id === user.id;
  let inTenant = false;
  if (role?.tenant_id) {
    const { data: tu } = await supabase
      .from("tenant_users")
      .select("id")
      .eq("tenant_id", role.tenant_id)
      .eq("user_id", user.id)
      .maybeSingle();
    inTenant = !!tu;
  }

  if (!isOwner && !inTenant) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Access denied" }),
    };
  }

  const { error: deleteError } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidate.id);

  if (deleteError) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: deleteError.message }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ success: true, message: "Candidate data purged" }),
  };
}
