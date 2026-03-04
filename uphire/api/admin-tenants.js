/**
 * Netlify serverless function: Fetch all tenants (UPhire staff only)
 * GET /api/admin-tenants
 * Requires: Authorization: Bearer <user_jwt>
 * Staff check: is_uphire_staff() OR email in UPHIRE_STAFF_EMAILS env
 */

import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfigured" }),
    };
  }

  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Authorization required" }),
    };
  }

  // Option A: Use user's JWT to call RPC (RPC checks is_uphire_staff)
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: rpcData, error: rpcError } = await userClient.rpc("get_all_tenants_for_staff");

  if (rpcError) {
    // If RPC fails (e.g. access denied), try Option B: staff emails from env
    const staffEmails = (process.env.UPHIRE_STAFF_EMAILS || "").toLowerCase().split(",").map((e) => e.trim()).filter(Boolean);
    if (staffEmails.length > 0) {
      const { data: userData } = await userClient.auth.getUser(token);
      const email = userData?.user?.email?.toLowerCase();
      if (email && staffEmails.includes(email)) {
        const adminClient = createClient(supabaseUrl, serviceKey);
        const { data: tenants } = await adminClient.from("tenants").select("id, name, slug, created_at").order("name");
        const withCounts = await Promise.all(
          (tenants || []).map(async (t) => {
            const [rolesRes, usersRes] = await Promise.all([
              adminClient.from("roles").select("id", { count: "exact", head: true }).eq("tenant_id", t.id),
              adminClient.from("tenant_users").select("id", { count: "exact", head: true }).eq("tenant_id", t.id),
            ]);
            return {
              ...t,
              role_count: rolesRes?.count ?? 0,
              user_count: usersRes?.count ?? 0,
            };
          })
        );
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenants: withCounts }),
        };
      }
    }
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: rpcError.message || "Access denied" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenants: rpcData || [] }),
  };
}
