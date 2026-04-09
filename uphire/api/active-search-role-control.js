"use strict";

const { json, updateRoleControl } = require("./_lib/active-search-runtime");

exports.handler = async function handler(event) {
  try {
    const body = event && event.body ? JSON.parse(event.body) : {};
    const result = await updateRoleControl(body);
    return json(200, { ok: true, ...result });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
