/**
 * Job board connector abstraction - types and interface.
 * Enables pluggable connectors for LinkedIn, Indeed, Broadbean, etc.
 */

export interface JobPost {
  title: string;
  description?: string;
  location?: string;
  salary?: string;
  employmentType?: string;
  [key: string]: unknown;
}

export interface JobBoardCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  expiresAt?: string;
}

export interface PostJobResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

export interface JobBoardConnector {
  readonly boardType: string;
  postJob(credentials: JobBoardCredentials, job: JobPost): Promise<PostJobResult>;
  refreshToken?(credentials: JobBoardCredentials): Promise<JobBoardCredentials>;
}
