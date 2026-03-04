/**
 * Netlify serverless function: Roles with no applicants after 5+ days
 * GET /api/roles-needing-attention?days=5
 * Returns roles that need outside resource to build shortlist.
 * UPhire staff only – requires Authorization: Bearer <jwt> and staff email or is_uphire_staff.
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

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const staffEmails = (process.env.UPHIRE_STAFF_EMAILS || "").toLowerCase().split(",").map((e) => e.trim()).filter(Boolean);
  const { data: userData } = await userClient.auth.getUser(token);
  const email = userData?.user?.email?.toLowerCase();

  const isStaff = email && staffEmails.includes(email);
  if (!isStaff) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Staff access required" }),
    };
  }

  const url = new URL(event.rawUrl || `http://localhost${event.path}${event.rawQuery ? `?${event.rawQuery}` : ""}`);
  const minDays = Math.min(14, Math.max(1, parseInt(url.searchParams.get("days") || "5", 10) || 5));

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.rpc("get_roles_needing_attention", { min_days: minDays });

  if (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles: data || [], minDays }),
  };
}
