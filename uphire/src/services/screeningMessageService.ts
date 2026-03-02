/**
 * Screening Message Exchange Service
 * Manages screening questions sent to candidates and their responses.
 * Candidates in screening_scheduled/screening_completed stage receive questions via email/message.
 */

import { sendCandidateMessage } from "./emailService";

export interface ScreeningQuestion {
  id: string;
  roleId: string;
  question: string;
  category: "experience" | "availability" | "motivation" | "technical" | "culture";
  order: number;
}

export interface ScreeningMessage {
  id: string;
  candidateId: string;
  candidateEmail: string;
  candidateName: string;
  roleId: string;
  roleTitle: string;
  direction: "outbound" | "inbound";
  content: string;
  questionId?: string;
  questionText?: string;
  createdAt: string;
}

export interface ScreeningConversation {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleId: string;
  roleTitle: string;
  messages: ScreeningMessage[];
  status: "in_progress" | "completed" | "passed" | "failed";
}

// In-memory store (replace with Supabase when ready)
const messageStore = new Map<string, ScreeningMessage[]>();
const conversationStatus = new Map<string, "in_progress" | "completed" | "passed" | "failed">();

const defaultScreeningQuestions: Omit<ScreeningQuestion, "roleId">[] = [
  { id: "q1", question: "Can you tell us about your relevant experience for this role?", category: "experience", order: 1 },
  { id: "q2", question: "What is your notice period / availability to start?", category: "availability", order: 2 },
  { id: "q3", question: "What interests you most about this position and our company?", category: "motivation", order: 3 },
  { id: "q4", question: "Describe a key achievement from your recent role.", category: "technical", order: 4 },
  { id: "q5", question: "How do you prefer to work - remotely, hybrid, or on-site?", category: "culture", order: 5 },
];

/**
 * Get screening questions for a role (can be customized per role later)
 */
export function getScreeningQuestions(roleId: string): ScreeningQuestion[] {
  return defaultScreeningQuestions.map((q) => ({
    ...q,
    roleId,
    id: `${roleId}-${q.id}`,
  }));
}

/**
 * Send a screening question to a candidate via email
 */
export async function sendScreeningQuestion(
  candidateEmail: string,
  candidateName: string,
  roleTitle: string,
  question: string,
  candidateId: string,
  roleId: string,
  questionId: string
): Promise<boolean> {
  const message: string = `As part of our screening process for the ${roleTitle} role, we'd like to ask:\n\n${question}\n\nPlease reply to this email with your response. We look forward to hearing from you.`;
  const sent = await sendCandidateMessage(candidateEmail, candidateName, message, roleTitle);
  if (sent) {
    const msg: ScreeningMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      candidateId,
      candidateEmail,
      candidateName,
      roleId: String(roleId),
      roleTitle,
      direction: "outbound",
      content: question,
      questionId,
      questionText: question,
      createdAt: new Date().toISOString(),
    };
    const key = `${roleId}-${candidateId}`;
    const existing = messageStore.get(key) || [];
    messageStore.set(key, [...existing, msg]);
  }
  return sent;
}

/**
 * Record an inbound response from a candidate (e.g. from email reply webhook or manual entry)
 */
export function recordCandidateResponse(
  candidateId: string,
  candidateEmail: string,
  candidateName: string,
  roleId: string,
  roleTitle: string,
  response: string
): void {
  const msg: ScreeningMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    candidateId,
    candidateEmail,
    candidateName,
    roleId: String(roleId),
    roleTitle,
    direction: "inbound",
    content: response,
    createdAt: new Date().toISOString(),
  };
  const key = `${roleId}-${candidateId}`;
  const existing = messageStore.get(key) || [];
  messageStore.set(key, [...existing, msg]);
}

/**
 * Get full conversation for a candidate in screening
 */
export function getScreeningConversation(
  roleId: string,
  candidateId: string,
  candidateName: string,
  candidateEmail: string,
  roleTitle: string
): ScreeningConversation {
  const key = `${roleId}-${candidateId}`;
  const messages = (messageStore.get(key) || []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const status = conversationStatus.get(key) || "in_progress";
  return {
    candidateId,
    candidateName,
    candidateEmail,
    roleId: String(roleId),
    roleTitle,
    messages,
    status,
  };
}

/**
 * Mark screening as passed or failed
 */
export function setScreeningOutcome(
  roleId: string,
  candidateId: string,
  outcome: "passed" | "failed"
): void {
  const key = `${roleId}-${candidateId}`;
  conversationStatus.set(key, outcome);
}

/**
 * Start screening for a candidate - sends first question
 */
export async function startScreening(
  candidateEmail: string,
  candidateName: string,
  candidateId: string,
  roleId: string,
  roleTitle: string
): Promise<boolean> {
  const questions = getScreeningQuestions(roleId);
  const first = questions[0];
  if (!first) return false;
  return sendScreeningQuestion(
    candidateEmail,
    candidateName,
    roleTitle,
    first.question,
    candidateId,
    roleId,
    first.id
  );
}
