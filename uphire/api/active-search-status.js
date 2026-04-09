"use strict";

const { json, getRoleStatus } = require("./_lib/active-search-runtime");

exports.handler = async function handler(event) {
  try {
    const roleId = event && event.queryStringParameters ? event.queryStringParameters.roleId : null;
    if (!roleId) {
      return json(400, { ok: false, error: "Missing roleId query parameter." });
    }

    const data = await getRoleStatus(roleId);
    return json(200, { ok: true, data });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
