import {
  createDefaultConnectorRegistry,
  InMemoryActiveSearchRepository,
  runActiveSearchSweep,
  SupabaseActiveSearchRepository,
} from "../../api/_lib/active-search";

type HandlerResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

export async function handler(): Promise<HandlerResponse> {
  try {
    const repository =
      process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL
        ? new SupabaseActiveSearchRepository()
        : new InMemoryActiveSearchRepository();
    const connectors = createDefaultConnectorRegistry();

    const result = await runActiveSearchSweep(repository, connectors);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: true,
        message: "Active Search sweep completed.",
        processedRoles: result.processed,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: message,
      }),
    };
  }
}
