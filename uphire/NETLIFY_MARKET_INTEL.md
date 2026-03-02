# Market Intelligence – Netlify Setup

The Market Intelligence salary benchmarking now uses **Netlify Functions** for Adzuna and ITJobsWatch. These are deployed with your site.

## Add Environment Variables in Netlify

1. Go to [Netlify](https://app.netlify.com) → your site → **Site settings** → **Environment variables**
2. Add these variables (click **Add a variable** / **Import from .env**):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ADZUNA_APP_ID` | Yes (for Adzuna) | Get from [developer.adzuna.com](https://developer.adzuna.com/) |
| `VITE_ADZUNA_APP_KEY` | Yes (for Adzuna) | Get from [developer.adzuna.com](https://developer.adzuna.com/) |
| `VITE_GROK_API_KEY` | No | Get from [x.ai](https://x.ai/) for AI-powered market data |

**Note:** ITJobsWatch doesn’t need an API key; it uses public pages.

## After Adding Variables

1. Trigger a **new deploy** (Deploys → Trigger deploy).
2. Wait for the build to finish.
3. Try Market Intelligence again – salary data should appear from Adzuna and/or ITJobsWatch.

## What Was Added

- `api/adzuna-proxy.js` – Netlify Function for Adzuna job data
- `api/itjobswatch-proxy.js` – Netlify Function for ITJobsWatch salary data
- Redirects in `netlify.toml` so `/api/adzuna-proxy` and `/api/itjobswatch-proxy` route to these functions

## I Cannot Connect to Netlify

I can’t access your Netlify account or add env vars for you. To finish setup:

1. Add the variables above in Netlify.
2. Redeploy the site.
