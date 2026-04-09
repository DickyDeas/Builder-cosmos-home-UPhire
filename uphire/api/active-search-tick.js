"use strict";

const { json, runGlobalTick } = require("./_lib/active-search-runtime");

exports.handler = async function handler() {
  try {
    const result = await runGlobalTick();
    return json(200, {
      ok: true,
      message: "Active Search sweep completed.",
      ...result,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
