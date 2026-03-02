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
