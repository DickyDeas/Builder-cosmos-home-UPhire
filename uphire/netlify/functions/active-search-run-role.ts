import {
  createDefaultConnectorRegistry,
  InMemoryActiveSearchRepository,
  runActiveSearchSweepForRole,
  SupabaseActiveSearchRepository,
} from "../../api/_lib/active-search";

type HandlerEvent = {
  body?: string | null;
};

type HandlerResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

type RunRolePayload = {
  roleId?: string;
};

function createRepository() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    return new SupabaseActiveSearchRepository();
  }
  return new InMemoryActiveSearchRepository();
}

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  try {
    const payload = JSON.parse(event.body ?? "{}") as RunRolePayload;
    if (!payload.roleId) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: "Missing roleId in request body." }),
      };
    }

    const repository = createRepository();
    const connectors = createDefaultConnectorRegistry();
    const result = await runActiveSearchSweepForRole(payload.roleId, repository, connectors);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: true,
        processedRoles: result.processed,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: message }),
    };
  }
}
