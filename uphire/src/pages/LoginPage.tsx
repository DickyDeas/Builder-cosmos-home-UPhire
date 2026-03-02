import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User, Mail, Lock, Loader2 } from "lucide-react";

const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
  if (!pwd) return { score: 0, label: "", color: "bg-gray-200" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
  if (pwd.length >= 12) score++;
  const levels = [
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-amber-500" },
    { label: "Good", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-green-500" },
    { label: "Very strong", color: "bg-green-600" },
  ];
  const idx = Math.min(score, 4);
  const level = levels[idx];
  return { score, label: level.label, color: level.color };
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const emailNorm = email.trim().toLowerCase();
    const isDemo =
      !isSignUp &&
      (emailNorm === "demo@google" || emailNorm === "demo@google.com") &&
      password === "123456";

    if (isDemo) {
      sessionStorage.setItem("uphire_demo", "true");
      navigate(from, { replace: true });
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { score } = getPasswordStrength(password);
      if (score < 3) {
        setMessage({
          type: "error",
          text: "Password must be at least 8 characters with uppercase, lowercase, number and special character.",
        });
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: "success", text: "Check your email for the confirmation link." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your email address." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/app/login`,
      });
      if (error) throw error;
      setMessage({ type: "success", text: "Check your email for the password reset link." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* UPhire logo central - no burger menu */}
      <header className="pt-8 pb-4">
        <div className="flex flex-col items-center text-center px-4">
          <Link to="/">
            <img
              src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-logo-no-background-pink-text-72849d?format=webp&width=800"
              alt="UPhire"
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-relaxed bg-uphire-hero-text bg-clip-text text-transparent">
            AI-powered recruitment infrastructure for modern teams.
          </p>
        </div>
      </header>

      {/* Form card */}
      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-white border-opacity-20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignUp ? "Create your account" : "Sign in"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isSignUp ? "Sign up to get started with UPhireIQ" : "Sign in to your UPhireIQ account"}
            </p>
          </div>

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
              </div>
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setMessage(null); }}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={isSignUp ? 8 : 6}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              {isSignUp && password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const ps = getPasswordStrength(password);
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded transition-colors ${
                            i <= ps.score ? ps.color : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-600">
                    {getPasswordStrength(password).label}
                    {getPasswordStrength(password).score < 3 && " – Need: 8+ chars, upper, lower, number, special"}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="mt-1 text-sm text-teal-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <User className="w-5 h-5" />
              )}
              {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>
          )}

          {!showForgotPassword && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-purple-600 font-medium hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
          )}

          <p className="mt-6 text-center">
            <Link to="/" className="text-sm text-white/80 hover:text-white">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
