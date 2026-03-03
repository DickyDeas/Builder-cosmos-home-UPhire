/**
 * Placeholder job board connector - template for LinkedIn, Indeed, Broadbean.
 * Replace with real API integrations.
 */

import type { JobBoardConnector, JobBoardCredentials, JobPost, PostJobResult } from "./types";
import { registerConnector } from "./registry";

const PLACEHOLDER_BOARD_TYPES = ["linkedin", "indeed", "broadbean", "reed", "cv_library"];

function createPlaceholderConnector(boardType: string): JobBoardConnector {
  return {
    boardType,
    async postJob(credentials: JobBoardCredentials, job: JobPost): Promise<PostJobResult> {
      if (!credentials.accessToken && !credentials.apiKey) {
        return { success: false, error: "No credentials configured for this board" };
      }
      // Placeholder: actual implementation would call board-specific API
      console.warn(`[${boardType}] Post job placeholder - integration pending`);
      return { success: true, externalId: `placeholder-${Date.now()}` };
    },
  };
}

export function registerPlaceholderConnectors(): void {
  for (const type of PLACEHOLDER_BOARD_TYPES) {
    registerConnector(createPlaceholderConnector(type));
  }
}
