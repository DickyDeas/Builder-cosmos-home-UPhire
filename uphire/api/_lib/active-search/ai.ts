import { AiGenerateRequest, AiGenerateResponse, AiProvider } from "./types";

const DEFAULT_GROK_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_GROK_MODEL = "grok-2-latest";
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_RETRIES = 2;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export class GrokAiProvider implements AiProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(config?: {
    apiKey?: string;
    apiUrl?: string;
    model?: string;
    timeoutMs?: number;
    maxRetries?: number;
  }) {
    this.apiKey = config?.apiKey ?? getRequiredEnv("GROK_API_KEY");
    this.apiUrl = config?.apiUrl ?? process.env.GROK_API_URL ?? DEFAULT_GROK_URL;
    this.model = config?.model ?? process.env.GROK_MODEL ?? DEFAULT_GROK_MODEL;
    this.timeoutMs = config?.timeoutMs ?? Number(process.env.GROK_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
    this.maxRetries = config?.maxRetries ?? Number(process.env.GROK_MAX_RETRIES ?? DEFAULT_MAX_RETRIES);
  }

  async generate(request: AiGenerateRequest): Promise<AiGenerateResponse> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            temperature: request.temperature ?? 0.3,
            max_tokens: request.maxTokens ?? 700,
            messages: request.messages,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const body = await response.text();
          throw new Error(`Grok request failed (${response.status}): ${body}`);
        }

        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
          model?: string;
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) {
          throw new Error("Grok response missing completion text.");
        }

        return {
          text,
          model: data.model ?? this.model,
        };
      } catch (error) {
        lastError = error;
        if (attempt >= this.maxRetries) break;
        const retryDelayMs = 350 * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    throw new Error(
      `Grok request failed after ${this.maxRetries + 1} attempts: ${
        lastError instanceof Error ? lastError.message : "Unknown error"
      }`
    );
  }
}

export class FallbackAiProvider implements AiProvider {
  async generate(request: AiGenerateRequest): Promise<AiGenerateResponse> {
    return {
      text: `Fallback response for task: ${request.task}`,
      model: "fallback-static",
    };
  }
}

export function createDefaultAiProvider(): AiProvider {
  if (process.env.GROK_API_KEY) {
    return new GrokAiProvider();
  }
  return new FallbackAiProvider();
}
