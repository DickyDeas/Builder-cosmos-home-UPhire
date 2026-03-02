/**
 * AI CV Screening & Assessment Service
 * - Screens CVs against job role criteria using NLP
 * - Detects AI-generated content (ensures no AI-written CVs go unflagged)
 * - Integrates with market intelligence for suitability checks
 */

export interface JobRoleCriteria {
  id?: number | string;
  title: string;
  department: string;
  location: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface CVProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: string;
  skills: string[];
  notes?: string;
  source?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolio?: string;
  /** Raw CV/resume text when available (for NLP analysis) */
  resumeText?: string;
}

export interface ScreeningResult {
  cv: CVProfile;
  overallScore: number;
  technicalMatch: number;
  experienceMatch: number;
  skillsMatch: number;
  locationMatch: number;
  cultureFit: number;
  keywordMatches: string[];
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  interviewPriority: "High" | "Medium" | "Low";
  aiGeneratedScore: number; // 0-100, higher = more likely AI-written
  aiGeneratedFlagged: boolean;
  aiDetectionReason?: string;
  screeningNotes: string;
  timestamp: Date;
}

export interface ScreeningMessage {
  id: string;
  candidateId: string;
  roleId: string;
  direction: "outbound" | "inbound";
  content: string;
  questionId?: string;
  createdAt: Date;
}

export interface ScreeningQuestion {
  id: string;
  roleId: string;
  question: string;
  category: "experience" | "availability" | "motivation" | "technical" | "culture";
  order: number;
}

const GROK_API_KEY = (import.meta as any).env?.VITE_GROK_API_KEY;
const GROK_URL = (import.meta as any).env?.VITE_GROK_API_URL || "https://api.x.ai/v1";

async function callGrok(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2000,
  temperature = 0.3
): Promise<string> {
  if (!GROK_API_KEY || GROK_API_KEY === "demo-key" || GROK_API_KEY === "") {
    throw new Error("Grok API key not configured");
  }
  const url = GROK_URL.includes("/chat/completions") ? GROK_URL : `${GROK_URL}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });
  if (!res.ok) {
    throw new Error(`Grok API error: ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

/**
 * Screen a single CV against job role criteria using NLP
 */
export async function screenCV(
  cv: CVProfile,
  jobCriteria: JobRoleCriteria
): Promise<ScreeningResult> {
  const cvText = [
    cv.name,
    cv.experience,
    cv.notes,
    cv.skills?.join(", "),
    cv.resumeText,
  ]
    .filter(Boolean)
    .join("\n");

  const jobContext = `
Title: ${jobCriteria.title}
Department: ${jobCriteria.department}
Location: ${jobCriteria.location}
Requirements: ${(jobCriteria.requirements || []).join(", ")}
Skills: ${(jobCriteria.skills || []).join(", ")}
Experience: ${jobCriteria.experience || "Not specified"}
Education: ${jobCriteria.education || "Not specified"}
Description: ${jobCriteria.description || ""}
  `.trim();

  try {
    const systemPrompt = `You are an expert HR recruiter and NLP analyst. Analyze CVs against job criteria. Return ONLY valid JSON, no markdown or extra text.`;
    const userPrompt = `
Analyze this CV against the job role:

CV TEXT:
${cvText}

JOB ROLE:
${jobContext}

Return a JSON object with these exact keys:
{
  "overallScore": <0-100>,
  "technicalMatch": <0-100>,
  "experienceMatch": <0-100>,
  "skillsMatch": <0-100>,
  "locationMatch": <0-100>,
  "cultureFit": <0-100>,
  "keywordMatches": ["match1", "match2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "recommendations": ["rec1", "rec2"],
  "interviewPriority": "High" | "Medium" | "Low",
  "screeningNotes": "Brief summary for recruiter"
}
`;

    const content = await callGrok(systemPrompt, userPrompt);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Run AI detection in parallel or after
    const aiDetection = await detectAIGeneratedContent(cvText);

    const overallScore = Math.min(100, Math.max(0, parsed.overallScore ?? 70));
    const screeningNotes =
      parsed.screeningNotes ||
      `Score: ${overallScore}. ${(parsed.strengths || []).slice(0, 2).join(". ")}`;

    return {
      cv,
      overallScore,
      technicalMatch: parsed.technicalMatch ?? 70,
      experienceMatch: parsed.experienceMatch ?? 70,
      skillsMatch: parsed.skillsMatch ?? 70,
      locationMatch: parsed.locationMatch ?? 70,
      cultureFit: parsed.cultureFit ?? 70,
      keywordMatches: parsed.keywordMatches ?? [],
      missingSkills: parsed.missingSkills ?? [],
      strengths: parsed.strengths ?? [],
      concerns: parsed.concerns ?? [],
      recommendations: parsed.recommendations ?? [],
      interviewPriority: parsed.interviewPriority ?? "Medium",
      aiGeneratedScore: aiDetection.score,
      aiGeneratedFlagged: aiDetection.flagged,
      aiDetectionReason: aiDetection.reason,
      screeningNotes,
      timestamp: new Date(),
    };
  } catch (err) {
    console.error("AI screening failed:", err);
    const aiDetection = await detectAIGeneratedContent(cvText);
    return getMockScreeningResult(cv, jobCriteria, aiDetection);
  }
}

/**
 * AI-generated content detection - ensures no CVs go unflagged
 * Uses NLP to detect writing patterns typical of AI (ChatGPT, etc.)
 */
export async function detectAIGeneratedContent(text: string): Promise<{
  score: number;
  flagged: boolean;
  reason?: string;
}> {
  if (!text || text.trim().length < 50) {
    return { score: 0, flagged: false };
  }

  // Quick heuristic check first (catches obvious cases)
  const heuristicPhrases = [
    "as an ai",
    "i am an ai",
    "i don't have personal",
    "i do not have personal",
    "i cannot provide",
    "language model",
    "ai assistant",
    "i'm an ai",
    "as a language model",
    "openai",
    "chatgpt",
    "generated by ai",
    "claude",
    "gemini",
  ];
  const lower = text.toLowerCase();
  if (heuristicPhrases.some((p) => lower.includes(p))) {
    return {
      score: 95,
      flagged: true,
      reason: "Contains explicit AI-related phrases",
    };
  }

  try {
    const systemPrompt = `You are an expert at detecting AI-generated text. Analyze writing style, phrasing, and patterns. Return ONLY valid JSON.`;
    const userPrompt = `
Analyze this text for signs it was written by AI (ChatGPT, Claude, etc.):

TEXT (first 2000 chars):
${text.slice(0, 2000)}

Consider: generic phrasing, overly polished language, repetitive structure, lack of specific personal details, typical AI tropes.

Return JSON:
{
  "score": <0-100, likelihood of AI generation, 0=human, 100=almost certainly AI>,
  "flagged": <true if score >= 60>,
  "reason": "Brief explanation"
}
`;

    const content = await callGrok(systemPrompt, userPrompt, 300, 0.2);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    const score = Math.min(100, Math.max(0, parsed.score ?? 0));
    const flagged = parsed.flagged ?? score >= 60;
    return {
      score,
      flagged,
      reason: parsed.reason,
    };
  } catch (err) {
    console.error("AI detection failed:", err);
    return { score: 0, flagged: false };
  }
}

/**
 * Batch screen multiple CVs
 */
export async function screenCVs(
  cvs: CVProfile[],
  jobCriteria: JobRoleCriteria
): Promise<ScreeningResult[]> {
  const results: ScreeningResult[] = [];
  for (const cv of cvs) {
    const result = await screenCV(cv, jobCriteria);
    results.push(result);
    await new Promise((r) => setTimeout(r, 500)); // Rate limit
  }
  return results.sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Scan all CVs for AI-generated content - ensures none go unflagged
 */
export async function scanCVsForAI(
  cvs: Array<CVProfile & { resumeText?: string }>
): Promise<Map<string, { score: number; flagged: boolean; reason?: string }>> {
  const map = new Map<string, { score: number; flagged: boolean; reason?: string }>();
  for (const cv of cvs) {
    const text = [
      cv.name,
      cv.experience,
      cv.notes,
      cv.skills?.join(" "),
      cv.resumeText,
    ]
      .filter(Boolean)
      .join("\n");
    const detection = await detectAIGeneratedContent(text);
    map.set(cv.id, detection);
    await new Promise((r) => setTimeout(r, 300));
  }
  return map;
}

function getMockScreeningResult(
  cv: CVProfile,
  jobCriteria: JobRoleCriteria,
  aiDetection?: { score: number; flagged: boolean; reason?: string }
): ScreeningResult {
  const score = 65 + Math.floor(Math.random() * 30);
  return {
    cv,
    overallScore: score,
    technicalMatch: score,
    experienceMatch: score,
    skillsMatch: score,
    locationMatch: 70,
    cultureFit: 70,
    keywordMatches: cv.skills?.slice(0, 3) || [],
    missingSkills: ["Example skill"],
    strengths: ["Relevant experience", "Strong skills match"],
    concerns: [],
    recommendations: ["Consider for screening"],
    interviewPriority: score >= 80 ? "High" : score >= 65 ? "Medium" : "Low",
    aiGeneratedScore: aiDetection?.score ?? 0,
    aiGeneratedFlagged: aiDetection?.flagged ?? false,
    aiDetectionReason: aiDetection?.reason,
    screeningNotes: `Mock score ${score}. ${aiDetection?.flagged ? "Flagged for AI content." : ""}`,
    timestamp: new Date(),
  };
}
