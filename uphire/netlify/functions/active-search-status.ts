import {
  InMemoryActiveSearchRepository,
  SupabaseActiveSearchRepository,
} from "../../api/_lib/active-search";

type HandlerEvent = {
  queryStringParameters?: Record<string, string | undefined>;
};

type HandlerResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

function createRepository() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    return new SupabaseActiveSearchRepository();
  }
  return new InMemoryActiveSearchRepository();
}

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  try {
    const roleId = event.queryStringParameters?.roleId;
    if (!roleId) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: "Missing roleId query parameter." }),
      };
    }

    const repository = createRepository();
    const commandCentre = await repository.getRoleCommandCentre(roleId);
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, data: commandCentre }),
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
