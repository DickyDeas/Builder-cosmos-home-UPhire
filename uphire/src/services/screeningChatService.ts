/**
 * Live Screening Chat Service
 * - Generates role-specific skill questions (not generic years/experience)
 * - Manages timed screening sessions
 * - Stores responses with timestamps to prevent googling
 */

import { supabase } from "@/lib/supabaseClient";
import { callGrokViaProxy } from "@/lib/grokProxyClient";

export interface RoleContext {
  title: string;
  department: string;
  location?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  category: "key_skill" | "technical_depth" | "problem_solving" | "practical_experience" | "availability";
  skillFocus?: string; // e.g. "React", "Project Management"
  order: number;
}

export interface ScreeningSession {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleId: string;
  roleTitle: string;
  roleContext: RoleContext;
  questions: ScreeningQuestion[];
  responses: Array<{
    questionId: string;
    question: string;
    response: string;
    startedAt: string;
    submittedAt: string;
    timeSpentSeconds: number;
    timedOut: boolean;
  }>;
  status: "in_progress" | "completed" | "expired";
  createdAt: string;
}

const DEFAULT_TIME_PER_QUESTION_SECONDS = 120; // 2 minutes - prevents googling

const STORAGE_KEY = "uphire_screening_sessions";

function loadSessions(): Map<string, ScreeningSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const obj = JSON.parse(raw) as Record<string, ScreeningSession>;
      return new Map(Object.entries(obj));
    }
  } catch {
    // ignore
  }
  return new Map();
}

function saveSessions(map: Map<string, ScreeningSession>) {
  try {
    const obj = Object.fromEntries(map);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // ignore
  }
}

function getSessionStore(): Map<string, ScreeningSession> {
  return loadSessions();
}

function generateSessionId(): string {
  return `sct-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function generateQuestionId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function callGrok(systemPrompt: string, userPrompt: string, maxTokens = 1500): Promise<string> {
  return callGrokViaProxy({
    systemPrompt,
    userPrompt,
    maxTokens,
    temperature: 0.4,
  });
}

/**
 * Generate role-specific skill questions - focused on key skills, not generic years
 */
export async function generateRoleSpecificQuestions(roleContext: RoleContext): Promise<ScreeningQuestion[]> {
  const skills = roleContext.skills || roleContext.requirements || [];
  const skillsStr = skills.length > 0 ? skills.join(", ") : "from the job description";

  try {
    const systemPrompt = `You are an expert technical recruiter. Generate screening questions that assess specific skills and competencies. 
Focus on: practical application, problem-solving, technical depth. NOT generic questions like "years of experience" or "notice period".
Return ONLY valid JSON array.`;

    const userPrompt = `
For this role, generate 5-6 screening questions focused on KEY SKILLS and competencies:

Role: ${roleContext.title}
Department: ${roleContext.department}
Key skills/requirements: ${skillsStr}
Description: ${(roleContext.description || "").slice(0, 500)}

Requirements:
1. Each question must assess a SPECIFIC skill or competency (e.g. "Describe how you would handle X in React", "Give an example of when you used Y")
2. Questions should require practical knowledge - not easily googled in 2 minutes
3. Mix: technical depth, problem-solving, practical experience
4. NO generic "How many years?" or "What is your salary?" - focus on skills
5. Include the skill being assessed in each question

Return JSON array:
[
  {"question": "...", "category": "key_skill"|"technical_depth"|"problem_solving"|"practical_experience", "skillFocus": "SkillName"},
  ...
]
`;

    const content = await callGrok(systemPrompt, userPrompt);
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return (parsed as Array<{ question: string; category?: string; skillFocus?: string }>).map((q, i) => ({
      id: generateQuestionId(),
      question: q.question || "",
      category: (q.category as ScreeningQuestion["category"]) || "key_skill",
      skillFocus: q.skillFocus,
      order: i + 1,
    }));
  } catch (err) {
    console.error("Failed to generate questions:", err);
    return getFallbackQuestions(roleContext);
  }
}

function getFallbackQuestions(roleContext: RoleContext): ScreeningQuestion[] {
  const skills = roleContext.skills || roleContext.requirements || ["key skills"];
  const skill1 = skills[0] || "your core competency";
  const skill2 = skills[1] || "another key area";

  return [
    {
      id: generateQuestionId(),
      question: `Describe a specific project where you applied ${skill1}. What was your approach and outcome?`,
      category: "key_skill",
      skillFocus: skill1,
      order: 1,
    },
    {
      id: generateQuestionId(),
      question: `What challenges have you faced when working with ${skill2}, and how did you overcome them?`,
      category: "technical_depth",
      skillFocus: skill2,
      order: 2,
    },
    {
      id: generateQuestionId(),
      question: "Give an example of a complex problem you solved in your recent role. What was your process?",
      category: "problem_solving",
      order: 3,
    },
    {
      id: generateQuestionId(),
      question: `How would you explain ${skill1} to someone who is new to this area?`,
      category: "practical_experience",
      skillFocus: skill1,
      order: 4,
    },
    {
      id: generateQuestionId(),
      question: "What is your notice period and when could you start?",
      category: "availability",
      order: 5,
    },
  ];
}

/**
 * Create a new screening session and return the shareable link
 */
export async function createScreeningSession(
  candidateId: string,
  candidateName: string,
  candidateEmail: string,
  roleId: string,
  roleTitle: string,
  roleContext: RoleContext
): Promise<{ sessionId: string; link: string }> {
  const questions = await generateRoleSpecificQuestions(roleContext);
  const sessionId = generateSessionId();

  const session: ScreeningSession = {
    id: sessionId,
    candidateId,
    candidateName,
    candidateEmail,
    roleId,
    roleTitle,
    roleContext,
    questions,
    responses: [],
    status: "in_progress",
    createdAt: new Date().toISOString(),
  };

  // Persist: Supabase (if table exists) or localStorage
  try {
    const { error } = await supabase.from("screening_sessions").upsert({
      id: sessionId,
      candidate_id: candidateId,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      role_id: roleId,
      role_title: roleTitle,
      role_context: roleContext,
      questions,
      responses: [],
      status: "in_progress",
    });
    if (error) throw error;
  } catch {
    const store = getSessionStore();
    store.set(sessionId, session);
    saveSessions(store);
  }

  const baseUrl = (import.meta as any).env?.VITE_APP_URL || window.location.origin;
  const base = baseUrl.replace(/\/$/, "");
  const pathPrefix = base.endsWith("/app") ? base : `${base}/app`;
  const link = `${pathPrefix}/screening/${sessionId}`;

  return { sessionId, link };
}

/**
 * Get session by ID (async - fetches from Supabase or localStorage)
 */
export async function getSession(sessionId: string): Promise<ScreeningSession | null> {
  try {
    const { data, error } = await supabase
      .from("screening_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    if (!error && data) {
      const d = data as Record<string, unknown>;
      return {
        id: d.id,
        candidateId: d.candidate_id,
        candidateName: d.candidate_name,
        candidateEmail: d.candidate_email,
        roleId: d.role_id,
        roleTitle: d.role_title,
        roleContext: d.role_context,
        questions: d.questions,
        responses: d.responses || [],
        status: d.status,
        createdAt: d.created_at,
      } as ScreeningSession;
    }
  } catch {
    // fall through to localStorage
  }
  return getSessionStore().get(sessionId) || null;
}

/**
 * Submit a response for the current question
 */
export async function submitResponse(
  sessionId: string,
  questionId: string,
  question: string,
  response: string,
  startedAt: Date,
  timedOut: boolean
): Promise<{ success: boolean; nextQuestion?: ScreeningQuestion; completed?: boolean }> {
  let session: ScreeningSession | null;
  try {
    session = await getSession(sessionId);
  } catch {
    session = getSessionStore().get(sessionId) || null;
  }
  if (!session || session.status !== "in_progress") {
    return { success: false };
  }

  const timeSpentSeconds = Math.round((Date.now() - startedAt.getTime()) / 1000);

  session.responses.push({
    questionId,
    question,
    response,
    startedAt: startedAt.toISOString(),
    submittedAt: new Date().toISOString(),
    timeSpentSeconds,
    timedOut,
  });

  const answeredIds = new Set(session.responses.map((r) => r.questionId));
  const nextQuestion = session.questions.find((q) => !answeredIds.has(q.id));

  if (!nextQuestion) {
    session.status = "completed";
  }

  // Persist
  try {
    const { error } = await supabase
      .from("screening_sessions")
      .update({ responses: session.responses, status: session.status })
      .eq("id", sessionId);
    if (error) throw error;
  } catch {
    const store = getSessionStore();
    store.set(sessionId, session);
    saveSessions(store);
  }

  if (!nextQuestion) {
    return { success: true, completed: true };
  }
  return { success: true, nextQuestion };
}

/**
 * Get remaining time for current question (seconds)
 */
export const TIME_PER_QUESTION = DEFAULT_TIME_PER_QUESTION_SECONDS;
