import { RoleSpec, SourcedCandidateProfile, SourceCapabilities } from "./types";

export interface SourceConnector {
  name: string;
  getCapabilities: () => Promise<SourceCapabilities>;
  validateAccess: (clientId: string) => Promise<boolean>;
  searchCandidates: (roleSpec: RoleSpec, filters?: Record<string, unknown>) => Promise<SourcedCandidateProfile[]>;
  importCandidate: (sourceRef: string) => Promise<SourcedCandidateProfile | null>;
  sendMessage: (candidateRef: string, message: string) => Promise<{ sent: boolean; providerMessageId?: string }>;
  syncReplies: (roleId: string) => Promise<Array<{ candidateRef: string; message: string; receivedAt: string }>>;
}

export class SourceConnectorRegistry {
  private readonly connectors = new Map<string, SourceConnector>();

  register(connector: SourceConnector): void {
    this.connectors.set(connector.name, connector);
  }

  get(name: string): SourceConnector | undefined {
    return this.connectors.get(name);
  }

  list(): SourceConnector[] {
    return [...this.connectors.values()];
  }
}

export async function canRunConnectorActions(
  connector: SourceConnector,
  clientId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const access = await connector.validateAccess(clientId);
  if (!access) {
    return { allowed: false, reason: "Client access not authorized for source." };
  }

  const capabilities = await connector.getCapabilities();
  if (!capabilities.canSearchProfiles && !capabilities.canImportProfiles) {
    return { allowed: false, reason: "Source cannot search/import profiles." };
  }

  return { allowed: true };
}
