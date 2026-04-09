export interface ParsedScreening {
  knockoutStatus: "pass" | "fail";
  fitScore: number;
  stage: "qualified" | "borderline" | "rejected";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function parseScreeningText(text: string): ParsedScreening {
  const lower = text.toLowerCase();
  const knockoutStatus =
    lower.includes("knockout: fail") || lower.includes("knockout=fail") || lower.includes("knockout fail")
      ? "fail"
      : "pass";

  const scoreMatch = text.match(/score\s*[:=]\s*(\d{1,3})/i);
  const parsedScore = scoreMatch ? Number(scoreMatch[1]) : 60;
  const fitScore = clamp(parsedScore, 0, 100);

  const stage =
    knockoutStatus === "fail" ? "rejected" : fitScore >= 70 ? "qualified" : fitScore >= 50 ? "borderline" : "rejected";

  return { knockoutStatus, fitScore, stage };
}

export function classifyReplyText(text: string): {
  stage: "qualified" | "borderline" | "rejected";
  knockoutStatus: "pass" | "fail";
  fitScore: number;
  optOut: boolean;
} {
  const lower = text.toLowerCase();
  const positive = /(yes|interested|available|sounds good|keen)/i.test(lower);
  const negative = /(no|not interested|stop|unsubscribe|remove me|opt out|leave me alone)/i.test(lower);
  const optOut = /(stop|unsubscribe|remove me|opt out|leave me alone)/i.test(lower);

  if (negative) {
    return { stage: "rejected", knockoutStatus: "fail", fitScore: 10, optOut };
  }
  if (positive) {
    return { stage: "qualified", knockoutStatus: "pass", fitScore: 80, optOut: false };
  }
  return { stage: "borderline", knockoutStatus: "pass", fitScore: 55, optOut: false };
}
