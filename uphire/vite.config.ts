/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/app/",
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // Adzuna API proxy (avoids CORS, keeps keys server-side)
      {
        name: "adzuna-proxy",
        configureServer(server) {
          server.middlewares.use("/api/adzuna-proxy", async (req, res, next) => {
            const u = new URL(req.url ?? "/", "http://localhost");
            const appId = env.VITE_ADZUNA_APP_ID || "";
            const appKey = env.VITE_ADZUNA_APP_KEY || "";
            if (!appId || !appKey) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Adzuna API keys not configured" }));
              return;
            }
            u.searchParams.set("app_id", appId);
            u.searchParams.set("app_key", appKey);
            const target = `https://api.adzuna.com/v1/api/jobs/gb/search/1${u.search}`;
            try {
              const r = await fetch(target);
              const data = await r.json();
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            } catch (e) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Adzuna fetch failed" }));
            }
          });
        },
      },
      // Grok AI proxy (keeps API key server-side; use GROK_API_KEY in .env)
      {
        name: "grok-proxy",
        configureServer(server) {
          server.middlewares.use("/api/grok-proxy", async (req, res, next) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }
            const apiKey = env.GROK_API_KEY || env.VITE_GROK_API_KEY || "";
            const apiUrl = env.GROK_API_URL || env.VITE_GROK_API_URL || "https://api.x.ai/v1";
            if (!apiKey || apiKey === "demo-key") {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Grok API key not configured" }));
              return;
            }
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                const parsed = JSON.parse(body || "{}");
                const { systemPrompt, userPrompt, maxTokens = 2000, temperature = 0.3, model = "grok-beta" } = parsed;
                if (!userPrompt) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "Missing userPrompt" }));
                  return;
                }
                const url = apiUrl.includes("/chat/completions") ? apiUrl : `${apiUrl}/chat/completions`;
                const messages = systemPrompt
                  ? [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
                  : [{ role: "user", content: userPrompt }];
                const r = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
                  body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
                });
                const data = await r.json();
                const content = data?.choices?.[0]?.message?.content?.trim() ?? "";
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(r.ok ? { content } : { error: data?.error?.message || "Grok API error" }));
              } catch (e) {
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Grok proxy failed" }));
              }
            });
          });
        },
      },
      // Email send proxy (keeps Brevo key server-side; use EMAIL_SERVICE_API_KEY in .env)
      {
        name: "email-send-proxy",
        configureServer(server) {
          server.middlewares.use("/api/email-send", async (req, res, next) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }
            const apiKey = env.EMAIL_SERVICE_API_KEY || env.VITE_EMAIL_SERVICE_API_KEY || "";
            const apiUrl = env.EMAIL_SERVICE_URL || env.VITE_EMAIL_SERVICE_URL || "https://api.brevo.com/v3";
            const fromEmail = env.FROM_EMAIL || env.VITE_FROM_EMAIL || "noreply@uphireiq.com";
            if (!apiKey) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Email service not configured" }));
              return;
            }
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                const { to, subject, htmlContent, textContent, replyTo } = JSON.parse(body || "{}");
                if (!to || !subject) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "Missing to or subject" }));
                  return;
                }
                const toList = Array.isArray(to) ? to : [to];
                const r = await fetch(`${apiUrl}/smtp/email`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "api-key": apiKey },
                  body: JSON.stringify({
                    sender: { email: fromEmail, name: "UPhire" },
                    to: toList.map((e) => ({ email: e })),
                    subject,
                    htmlContent: htmlContent || textContent || "",
                    textContent,
                    replyTo: replyTo ? { email: replyTo } : undefined,
                  }),
                });
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(r.ok ? { success: true } : { error: "Email send failed" }));
              } catch (e) {
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Email proxy failed" }));
              }
            });
          });
        },
      },
      // Audit log proxy (dev: forwards to Supabase via service role)
      {
        name: "audit-log-proxy",
        configureServer(server) {
          server.middlewares.use("/api/audit-log", async (req, res, next) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }
            const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
            const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
            if (!supabaseUrl || !serviceKey) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Supabase not configured for audit log" }));
              return;
            }
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                const { tenantId, userId, action, resourceType, resourceId, metadata } = JSON.parse(body || "{}");
                if (!action) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "Missing action" }));
                  return;
                }
                const { createClient } = await import("@supabase/supabase-js");
                const supabase = createClient(supabaseUrl, serviceKey);
                const { error } = await supabase.from("audit_logs").insert({
                  tenant_id: tenantId || null,
                  user_id: userId || null,
                  action,
                  resource_type: resourceType || null,
                  resource_id: resourceId || null,
                  metadata: metadata || null,
                });
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(error ? { error: error.message } : { success: true }));
              } catch (e) {
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Audit log proxy failed" }));
              }
            });
          });
        },
      },
      // ITJobsWatch proxy (fetches and parses HTML)
      {
        name: "itjobswatch-proxy",
        configureServer(server) {
          server.middlewares.use("/api/itjobswatch-proxy", async (req, res, next) => {
            const url = new URL(req.url ?? "", "http://localhost");
            const skill = url.searchParams.get("skill") ?? "software engineering";
            const slug = encodeURIComponent(skill.replace(/\s+/g, "%20"));
            try {
              const fetchUrl = `https://www.itjobswatch.co.uk/jobs/uk/${slug}.do`;
              const r = await fetch(fetchUrl, {
                headers: { "User-Agent": "Mozilla/5.0 (compatible; UPhire/1.0)" },
              });
              const html = await r.text();
              const medianMatch =
                html.match(/Median annual salary[^£]*£([0-9,]+)/i) ??
                html.match(/50th Percentile[^£]*£([0-9,]+)/i);
              const p10Match = html.match(/10th Percentile[^£]*£([0-9,]+)/i);
              const p90Match = html.match(/90th Percentile[^£]*£([0-9,]+)/i);
              const median = medianMatch
                ? parseInt(medianMatch[1].replace(/,/g, ""), 10)
                : null;
              const p10 = p10Match
                ? parseInt(p10Match[1].replace(/,/g, ""), 10)
                : null;
              const p90 = p90Match
                ? parseInt(p90Match[1].replace(/,/g, ""), 10)
                : null;
              if (!median) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "No salary data found" }));
                return;
              }
              const body = JSON.stringify({
                median,
                percentile10: p10 ?? Math.round(median * 0.65),
                percentile90: p90 ?? Math.round(median * 1.5),
                min: p10 ?? Math.round(median * 0.65),
                max: p90 ?? Math.round(median * 1.5),
              });
              res.setHeader("Content-Type", "application/json");
              res.end(body);
            } catch (e) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "ITJobsWatch fetch failed" }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist/app",
      emptyOutDir: true,
    },
    test: {
      globals: true,
      environment: "node",
      include: ["src/**/*.spec.ts"],
    },
  };
});
