/**
 * Grok API client - calls /api/grok-proxy (server-side) so API key is never exposed to client.
 * Replace direct Grok calls with this client.
 */

export interface GrokProxyOptions {
  systemPrompt?: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * Call Grok via server-side proxy. API key stays on server.
 */
export async function callGrokViaProxy(options: GrokProxyOptions): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens = 2000, temperature = 0.3, model = "grok-beta" } = options;
  const res = await fetch("/api/grok-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt,
      userPrompt,
      maxTokens,
      temperature,
      model,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Grok proxy error: ${res.status}`);
  }
  return data?.content ?? "";
}
