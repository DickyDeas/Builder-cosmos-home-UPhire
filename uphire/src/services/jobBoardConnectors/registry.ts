/**
 * Job board connector registry - register and resolve connectors by board type.
 */

import type { JobBoardConnector } from "./types";

const connectors = new Map<string, JobBoardConnector>();

export function registerConnector(connector: JobBoardConnector): void {
  connectors.set(connector.boardType, connector);
}

export function getConnector(boardType: string): JobBoardConnector | undefined {
  return connectors.get(boardType);
}

export function listConnectorTypes(): string[] {
  return Array.from(connectors.keys());
}
