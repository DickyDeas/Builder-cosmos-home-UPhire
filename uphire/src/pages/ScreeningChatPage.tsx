/**
 * Live Screening Chat Page
 * - Candidate answers questions in real-time chat
 * - Timed per question to prevent googling answers
 * - Role-specific skill questions
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import {
  getSession,
  submitResponse,
  TIME_PER_QUESTION,
  type ScreeningQuestion,
  type ScreeningSession,
} from "@/services/screeningChatService";

const ScreeningChatPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<ScreeningSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ScreeningQuestion | null>(null);
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStartRef = useRef<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutHandledRef = useRef(false);

  // Load session and determine current question
  useEffect(() => {
    if (!sessionId) {
      setError("Invalid screening link");
      return;
    }
    let cancelled = false;
    getSession(sessionId).then((s) => {
      if (cancelled) return;
      if (!s) {
        setError("Screening session not found or expired");
        return;
      }
      setSession(s);

      if (s.status === "completed") {
        setCompleted(true);
        return;
      }

      const answeredIds = new Set(s.responses.map((r) => r.questionId));
      const next = s.questions.find((q) => !answeredIds.has(q.id));
      setCurrentQuestion(next || null);
      if (!next) {
        setCompleted(true);
      }
      questionStartRef.current = new Date();
      setTimeLeft(TIME_PER_QUESTION);
      timeoutHandledRef.current = false;
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || completed || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion?.id, completed, submitting]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0 && currentQuestion && !submitting) {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = async () => {
    if (!sessionId || !currentQuestion || submitting || timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    setSubmitting(true);
    const startedAt = questionStartRef.current || new Date();
    const result = await submitResponse(
      sessionId,
      currentQuestion.id,
      currentQuestion.question,
      response.trim() || "[No response - time expired]",
      startedAt,
      true
    );
    setSubmitting(false);
    setResponse("");
    if (result.completed) {
      setCompleted(true);
    } else if (result.nextQuestion) {
      setCurrentQuestion(result.nextQuestion);
      questionStartRef.current = new Date();
      setTimeLeft(TIME_PER_QUESTION);
      timeoutHandledRef.current = false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !currentQuestion || !response.trim() || submitting) return;

    setSubmitting(true);
    const startedAt = questionStartRef.current || new Date();
    const result = await submitResponse(
      sessionId,
      currentQuestion.id,
      currentQuestion.question,
      response.trim(),
      startedAt,
      false
    );
    setSubmitting(false);
    setResponse("");
    if (result.completed) {
      setCompleted(true);
    } else if (result.nextQuestion) {
      setCurrentQuestion(result.nextQuestion);
      questionStartRef.current = new Date();
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Screening not available</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  if (completed && session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Screening complete</h1>
          <p className="text-gray-600 mt-2">
            Thank you, {session.candidateName}. Your responses have been submitted and will be reviewed by our team.
            If your application is successful, you'll be contacted to schedule an interview with the hiring company.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col">
      <header className="bg-white/10 backdrop-blur border-b border-white/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-white">UPhire IQ Screening</h1>
            <p className="text-sm text-blue-200">{session.roleTitle}</p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              timeLeft <= 30 ? "bg-red-500/30 text-red-100" : "bg-white/20 text-white"
            }`}
          >
            <Clock size={18} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Chat history - previous Q&A */}
          {session.responses.map((r, i) => (
            <div key={i} className="space-y-2">
              <div className="bg-indigo-500/20 rounded-lg p-4 text-white">
                <p className="text-xs text-blue-200 mb-1">Question {i + 1}</p>
                <p>{r.question}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-white ml-4">
                <p className="text-xs text-blue-200 mb-1">
                  Your response {r.timedOut && "(time expired)"}
                </p>
                <p>{r.response}</p>
              </div>
            </div>
          ))}

          {/* Current question */}
          <div className="bg-indigo-500/20 rounded-lg p-4 text-white border-2 border-indigo-400/50">
            <p className="text-xs text-blue-200 mb-2">
              Question {session.responses.length + 1} of {session.questions.length}
              {currentQuestion.skillFocus && (
                <span className="ml-2 px-2 py-0.5 bg-indigo-400/30 rounded text-xs">
                  {currentQuestion.skillFocus}
                </span>
              )}
            </p>
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
        </div>
      </main>

      <footer className="bg-white/10 backdrop-blur border-t border-white/20 p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              rows={3}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg bg-white/95 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !response.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
            >
              <Send size={18} />
              {submitting ? "..." : "Submit"}
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-2">
            Timed response – you have {formatTime(timeLeft)} remaining. This helps us assess your knowledge.
          </p>
        </form>
      </footer>
    </div>
  );
};

export default ScreeningChatPage;
