"use strict";

const { json, getPortfolioHealthSummary } = require("./_lib/active-search-runtime");

exports.handler = async function handler(event) {
  try {
    const clientId = event && event.queryStringParameters ? event.queryStringParameters.clientId : null;
    const data = await getPortfolioHealthSummary(clientId);
    return json(200, { ok: true, data });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
