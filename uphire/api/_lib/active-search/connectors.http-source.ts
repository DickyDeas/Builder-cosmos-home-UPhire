import { RoleSpec, SourcedCandidateProfile, SourceCapabilities } from "./types";
import { SourceConnector } from "./connectors";

interface HttpSourceConnectorConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  defaultCapabilities?: Partial<SourceCapabilities>;
}

function readJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export class HttpSourceConnector implements SourceConnector {
  name: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultCapabilities: SourceCapabilities;

  constructor(config: HttpSourceConnectorConfig) {
    this.name = config.name;
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.defaultCapabilities = {
      sourceName: config.name,
      canSearchProfiles: true,
      canImportProfiles: true,
      canMessageCandidates: false,
      canSyncResponses: false,
      canViewContactDetails: true,
      rateLimits: {},
      complianceRules: {},
      ...config.defaultCapabilities,
    };
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${this.name} request failed (${response.status}): ${body}`);
    }
    if (response.status === 204) return [] as unknown as T;
    return (await response.json()) as T;
  }

  async getCapabilities(): Promise<SourceCapabilities> {
    try {
      const capabilities = await this.request<Partial<SourceCapabilities>>("/capabilities");
      return { ...this.defaultCapabilities, ...capabilities, sourceName: this.name };
    } catch {
      return this.defaultCapabilities;
    }
  }

  async validateAccess(clientId: string): Promise<boolean> {
    const result = await this.request<{ allowed: boolean }>("/validate-access", {
      method: "POST",
      body: JSON.stringify({ clientId }),
    }).catch(() => ({ allowed: false }));
    return Boolean(result.allowed);
  }

  async searchCandidates(
    roleSpec: RoleSpec,
    filters: Record<string, unknown> = {}
  ): Promise<SourcedCandidateProfile[]> {
    const result = await this.request<Array<Record<string, unknown>>>("/search", {
      method: "POST",
      body: JSON.stringify({ roleSpec, filters }),
    });

    return result.map((item) => ({
      sourceRef: String(item.sourceRef ?? item.id ?? ""),
      fullName: String(item.fullName ?? item.name ?? "Unknown"),
      email: typeof item.email === "string" ? item.email : undefined,
      phone: typeof item.phone === "string" ? item.phone : undefined,
      location: typeof item.location === "string" ? item.location : undefined,
      profile: item,
    }));
  }

  async importCandidate(sourceRef: string): Promise<SourcedCandidateProfile | null> {
    const item = await this.request<Record<string, unknown>>("/import", {
      method: "POST",
      body: JSON.stringify({ sourceRef }),
    }).catch(() => null);
    if (!item) return null;
    return {
      sourceRef: String(item.sourceRef ?? item.id ?? sourceRef),
      fullName: String(item.fullName ?? item.name ?? "Unknown"),
      email: typeof item.email === "string" ? item.email : undefined,
      phone: typeof item.phone === "string" ? item.phone : undefined,
      location: typeof item.location === "string" ? item.location : undefined,
      profile: item,
    };
  }

  async sendMessage(
    candidateRef: string,
    message: string
  ): Promise<{ sent: boolean; providerMessageId?: string }> {
    const response = await this.request<{ sent: boolean; providerMessageId?: string }>("/message", {
      method: "POST",
      body: JSON.stringify({ candidateRef, message }),
    }).catch(() => ({ sent: false }));
    return response;
  }

  async syncReplies(roleId: string): Promise<Array<{ candidateRef: string; message: string; receivedAt: string }>> {
    const replies = await this.request<Array<{ candidateRef: string; message: string; receivedAt: string }>>(
      `/replies?roleId=${encodeURIComponent(roleId)}`
    ).catch(() => []);
    return replies;
  }
}

export function createDefaultConnectorsFromEnv(): SourceConnector[] {
  const name = process.env.ACTIVE_SOURCE_NAME;
  const baseUrl = process.env.ACTIVE_SOURCE_BASE_URL;
  const apiKey = process.env.ACTIVE_SOURCE_API_KEY;

  if (!name || !baseUrl || !apiKey) {
    return [];
  }

  const rateLimits = readJson<Record<string, unknown>>(process.env.ACTIVE_SOURCE_RATE_LIMITS_JSON, {});
  const complianceRules = readJson<Record<string, unknown>>(
    process.env.ACTIVE_SOURCE_COMPLIANCE_JSON,
    {}
  );

  return [
    new HttpSourceConnector({
      name,
      baseUrl,
      apiKey,
      defaultCapabilities: {
        sourceName: name,
        canSearchProfiles: process.env.ACTIVE_SOURCE_CAN_SEARCH !== "false",
        canImportProfiles: process.env.ACTIVE_SOURCE_CAN_IMPORT !== "false",
        canMessageCandidates: process.env.ACTIVE_SOURCE_CAN_MESSAGE === "true",
        canSyncResponses: process.env.ACTIVE_SOURCE_CAN_SYNC === "true",
        canViewContactDetails: process.env.ACTIVE_SOURCE_CAN_VIEW_CONTACTS !== "false",
        rateLimits,
        complianceRules,
      },
    }),
  ];
}
