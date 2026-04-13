import { SourceConnectorRegistry } from "./connectors";
import { createDefaultConnectorsFromEnv } from "./connectors.http-source";

export function createDefaultConnectorRegistry(): SourceConnectorRegistry {
  const registry = new SourceConnectorRegistry();
  const connectors = createDefaultConnectorsFromEnv();
  for (const connector of connectors) {
    registry.register(connector);
  }
  return registry;
}
