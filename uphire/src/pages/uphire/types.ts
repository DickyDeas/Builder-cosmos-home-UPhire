/** Shared types for UPhire platform - extracted to reduce Index.tsx size and OOM risk */

export interface InterviewRecord {
  id: number;
  type: "screening" | "technical" | "cultural" | "final";
  status: "scheduled" | "completed" | "cancelled";
  date: string;
  interviewer: string;
  feedback?: string;
  rating?: number;
}

export interface ShortlistedCandidate {
  id: number;
  name: string;
  email: string;
  location: string;
  experience: string;
  skills: string[];
  aiMatch: number;
  source: string;
  applied: string;
  avatar: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  notes?: string;
  aiGenerated?: boolean;
  interviewStage:
    | "shortlisted"
    | "screening_scheduled"
    | "screening_completed"
    | "technical_scheduled"
    | "technical_completed"
    | "final_scheduled"
    | "final_completed"
    | "offer_made"
    | "hired"
    | "rejected";
  interviewHistory: InterviewRecord[];
  lastUpdated: string;
}

export interface Role {
  id: number | string;
  title: string;
  department: string;
  location: string;
  status: string;
  candidates: number;
  shortlisted: number;
  interviewed: number;
  created: string;
  salary: string;
  priority: string;
  deiScore: number;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  shortlistedCandidates?: ShortlistedCandidate[];
  keySkills?: string[];
  experienceLevel?: string;
  employmentType?: string;
  workPattern?: string;
  educationLevel?: string;
}

export interface Candidate {
  id: number;
  name: string;
  role: string;
  email: string;
  location: string;
  experience: string;
  skills: string[];
  aiMatch: number;
  status: string;
  source: string;
  applied: string;
  avatar: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  aiGenerated?: boolean;
  portfolio?: string;
  notes?: string;
}

export interface Document {
  id: number | string;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  autoSend: boolean;
  template: string;
  status?: string;
  date?: string;
}

export interface Employee {
  id: number | string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: string;
  manager: string;
  employmentType: string;
  probationPeriod: boolean;
  probationMonths: number;
  employeeId: string;
  documents: Document[];
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface MarketData {
  salary: {
    min: number;
    max: number;
    median: number;
  };
  demand: {
    level: string;
    trend: string;
    timeToFill: number;
    competition: string;
  };
  skills: {
    required: string[];
    trending: string[];
  };
  sourcesUsed?: string[];
  jobCount?: number;
}

export interface PredictionData {
  successRate: number;
  confidence: number;
  factors: {
    positive: string[];
    risks: string[];
  };
  recommendations: string[];
}

export interface JobBoardConfig {
  id: string;
  name: string;
  details: string;
  configured: boolean;
}

export interface OutreachTouchpoint {
  id: number;
  channel: "email" | "linkedin" | "job_board" | "indeed" | "sms" | "phone";
  sentAt: string;
  subject?: string;
  status: "sent" | "delivered" | "opened" | "replied" | "failed";
  response?: string;
}

export interface OutreachSequence {
  id: number;
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  status: "active" | "paused" | "completed" | "replied";
  touchpoints: OutreachTouchpoint[];
  source: "crm" | "job_board" | "linkedin" | "indeed" | "import";
}
