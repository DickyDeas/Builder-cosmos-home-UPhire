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
    const clientId = event.queryStringParameters?.clientId;
    const repository = createRepository();
    const data = await repository.getPortfolioHealthSummary(clientId);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, data }),
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
