"use strict";

const { json, runRoleSweep } = require("./_lib/active-search-runtime");

exports.handler = async function handler(event) {
  try {
    const body = event && event.body ? JSON.parse(event.body) : {};
    const roleId = body.roleId;
    if (!roleId) {
      return json(400, { ok: false, error: "Missing roleId in request body." });
    }

    const result = await runRoleSweep(roleId);
    return json(200, { ok: true, ...result });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
