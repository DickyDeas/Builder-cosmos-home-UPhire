import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeCommaList, sanitizeString, sanitizeId } from "@/lib/security";
import { fetchJsonWithTimeout, getUserFriendlyErrorMessage } from "@/lib/apiClient";

/**
 * Apply API base URL. Default "" uses window.location.origin (same domain).
 * Set VITE_APPLY_BASE_URL only if the apply API runs on a different origin
 * (e.g. separate backend, different subdomain). For Netlify/same-domain deploy, leave unset.
 */
const applyBaseUrl = import.meta.env.VITE_APPLY_BASE_URL || "";

const ApplyPage = () => {
  const params = useParams<{ roleId?: string; tenantSlug?: string; jobId?: string }>();
  const navigate = useNavigate();
  const roleId = params.jobId || params.roleId; // jobId from /apply/:tenantSlug/:jobId or roleId from /apply/:roleId
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeRoleId = roleId ? sanitizeId(roleId) : null;
    if (!safeRoleId) {
      setError("Invalid job link");
      return;
    }
    const name = sanitizeName(form.name);
    if (!name) {
      setError("Please enter your full name");
      return;
    }
    const email = sanitizeEmail(form.email);
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }
    const phone = form.phone ? sanitizePhone(form.phone) : undefined;
    const experience = form.experience ? sanitizeString(form.experience, 2000) : undefined;
    const skills = form.skills ? sanitizeCommaList(form.skills) : undefined;

    setLoading(true);
    setError(null);

    try {
      const apiBase = applyBaseUrl || window.location.origin;
      await fetchJsonWithTimeout<{ success?: boolean }>(
        `${apiBase}/api/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role_id: safeRoleId,
            name,
            email,
            phone: phone || undefined,
            experience,
            skills,
            source: "Job Board",
          }),
        },
        15000
      );
      setSubmitted(true);
    } catch (err) {
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-white border-opacity-20 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Application submitted</h1>
          <p className="text-gray-600 mt-2">
            Thank you for applying. We'll be in touch soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-slate-600 to-teal-500 text-white rounded-lg hover:from-slate-600 hover:to-teal-600 transition-colors shadow-md"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-white border-opacity-20 p-8">
        <div className="text-center mb-8">
          <img
            src="https://cdn.builder.io/api/v1/assets/e3ae173b79f74e84b0580a7f82f9aa6c/uphire-logo-no-background-pink-text-72849d?format=webp&width=800"
            alt="UPhire"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Apply for this role</h1>
          <p className="text-gray-600 mt-1">Submit your application below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <textarea
              value={form.experience}
              onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              rows={3}
              placeholder="Brief summary of your experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="e.g. React, TypeScript, Node.js"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-slate-600 to-teal-500 text-white font-medium rounded-lg hover:from-slate-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </p>
      </div>
    </div>
  );
};

export default ApplyPage;
