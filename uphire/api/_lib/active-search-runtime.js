"use strict";

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function getEnv(name, required) {
  const value = process.env[name];
  if (required && !value) throw new Error(`${name} is required`);
  return value;
}

function getConfig() {
  return {
    supabaseUrl: getEnv("VITE_SUPABASE_URL", false),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY", false),
  };
}

function hasSupabaseConfig() {
  const cfg = getConfig();
  return Boolean(cfg.supabaseUrl && cfg.serviceRoleKey);
}

async function supabaseRequest(path, init) {
  const cfg = getConfig();
  if (!cfg.supabaseUrl || !cfg.serviceRoleKey) {
    throw new Error("Supabase runtime not configured");
  }

  const response = await fetch(`${cfg.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: cfg.serviceRoleKey,
      authorization: `Bearer ${cfg.serviceRoleKey}`,
      "content-type": "application/json",
      ...(init && init.headers ? init.headers : {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed ${response.status}: ${text}`);
  }
  if (response.status === 204) return [];
  return response.json();
}

async function getPortfolioHealthSummary(clientId) {
  if (!hasSupabaseConfig()) {
    return {
      clientId: clientId || null,
      totalActiveRoles: 0,
      healthy: 0,
      weakPipeline: 0,
      atRisk: 0,
      stale: 0,
      escalated: 0,
      touchedWithinSlaPercent: 0,
      mode: "fallback",
      generatedAt: new Date().toISOString(),
    };
  }

  const query = clientId
    ? `roles?select=id,health_state,status,updated_at&status=eq.active&client_id=eq.${clientId}`
    : "roles?select=id,health_state,status,updated_at&status=eq.active";
  const rows = await supabaseRequest(query, { method: "GET" });

  const counts = {
    healthy: 0,
    weakPipeline: 0,
    atRisk: 0,
    stale: 0,
    escalated: 0,
  };
  const now = Date.now();
  let touched = 0;
  for (const row of rows) {
    if (row.health_state === "healthy") counts.healthy += 1;
    if (row.health_state === "weak_pipeline") counts.weakPipeline += 1;
    if (row.health_state === "at_risk") counts.atRisk += 1;
    if (row.health_state === "stale") counts.stale += 1;
    if (row.health_state === "escalated") counts.escalated += 1;
    const updatedAt = new Date(row.updated_at).getTime();
    if (Number.isFinite(updatedAt) && (now - updatedAt) / 36e5 <= 1) touched += 1;
  }

  return {
    clientId: clientId || null,
    totalActiveRoles: rows.length,
    ...counts,
    touchedWithinSlaPercent: rows.length ? Math.round((touched / rows.length) * 10000) / 100 : 0,
    generatedAt: new Date().toISOString(),
  };
}

async function getRoleStatus(roleId) {
  if (!hasSupabaseConfig()) {
    return {
      roleId,
      notFound: true,
      mode: "fallback",
      recommendedAction: "Configure Supabase runtime to enable full Active Search status.",
    };
  }

  const roleRows = await supabaseRequest(
    `roles?select=id,title,status,health_state,location,updated_at&id=eq.${roleId}&limit=1`,
    { method: "GET" }
  );
  if (!roleRows.length) return { roleId, notFound: true };
  const role = roleRows[0];

  const candidateRows = await supabaseRequest(
    `role_candidates?select=id,stage,knockout_status,updated_at&role_id=eq.${roleId}`,
    { method: "GET" }
  );

  const totalApplications = candidateRows.length;
  const qualifiedApplications = candidateRows.filter(
    (row) => row.knockout_status === "pass" || row.stage === "qualified" || row.stage === "shortlisted"
  ).length;
  const shortlistSize = candidateRows.filter((row) => row.stage === "shortlisted").length;

  return {
    role,
    metrics: {
      totalApplications,
      qualifiedApplications,
      shortlistSize,
    },
    recommendedAction:
      shortlistSize < 5
        ? "Increase sourcing intensity and review outreach cadence."
        : "Proceed with shortlist progression and interview scheduling.",
  };
}

async function updateRoleControl(body) {
  if (!body || !body.roleId) throw new Error("Missing roleId");
  if (!hasSupabaseConfig()) {
    return { ok: true, mode: "fallback", message: "No-op without Supabase configuration." };
  }

  const roleRows = await supabaseRequest(`roles?select=client_id&id=eq.${body.roleId}&limit=1`, { method: "GET" });
  const clientId = roleRows[0] && roleRows[0].client_id;
  if (!clientId) throw new Error("Role not found");

  await supabaseRequest("role_orchestrator_configs", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      role_id: body.roleId,
      client_id: clientId,
      paused: body.paused,
      mode: body.mode,
      rules_json: body.rulesJson,
      updated_at: new Date().toISOString(),
    }),
  });

  return { ok: true };
}

async function runRoleSweep(roleId) {
  if (!roleId) throw new Error("Missing roleId");
  if (!hasSupabaseConfig()) {
    return { processedRoles: 1, mode: "fallback" };
  }

  await supabaseRequest("audit_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      actor_type: "system",
      actor_id: "active-search-manual-trigger",
      entity_type: "role",
      entity_id: roleId,
      action: "manual_role_sweep_requested",
      payload_json: { roleId },
      created_at: new Date().toISOString(),
    }),
  });
  return { processedRoles: 1 };
}

async function runGlobalTick() {
  if (!hasSupabaseConfig()) return { processedRoles: 0, mode: "fallback" };

  const activeRoles = await supabaseRequest("roles?select=id&status=eq.active&limit=200", { method: "GET" });
  for (const role of activeRoles) {
    await supabaseRequest("audit_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        actor_type: "system",
        actor_id: "active-search-orchestrator",
        entity_type: "role",
        entity_id: role.id,
        action: "role_orchestrator_tick_completed",
        payload_json: { source: "api/active-search-tick.js" },
        created_at: new Date().toISOString(),
      }),
    });
  }

  return { processedRoles: activeRoles.length };
}

module.exports = {
  json,
  getPortfolioHealthSummary,
  getRoleStatus,
  updateRoleControl,
  runRoleSweep,
  runGlobalTick,
};
