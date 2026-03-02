# Netlify Deployment Checklist

**Pre-requisite:** Code pushed to GitHub.

---

## Step 1: Add Site in Netlify

1. Go to [netlify.com](https://netlify.com) and log in
2. **Add new site** → **Import an existing project**
3. Connect to **GitHub** and authorize
4. Select your repository
5. Configure build:
   - **Base directory:** `uphire` (if app is in subfolder)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `api` (if using Netlify Functions)

---

## Step 2: Add Environment Variables

In Netlify: **Site settings** → **Environment variables** → **Add a variable** or **Import from .env**.

Add these (copy values from your local `.env`):

| Variable | Required |
|----------|----------|
| VITE_SUPABASE_URL | Yes |
| VITE_SUPABASE_ANON_KEY | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Yes |
| VITE_SUPPORT_EMAIL | Yes |
| VITE_LEGAL_EMAIL | Yes |
| VITE_PRIVACY_EMAIL | Yes |
| VITE_SALES_EMAIL | Yes |
| VITE_BILLING_EMAIL | Yes |
| VITE_FROM_EMAIL | Yes |
| VITE_APPLY_BASE_URL | Yes |
| VITE_APP_URL | Yes (use `https://uphireiq.com/app` for subpath) |
| VITE_EMAIL_SERVICE_API_KEY | No (Brevo) |
| VITE_EMAIL_SERVICE_URL | No |
| VITE_CALENDLY_URL | No |
| VITE_GROK_API_KEY | No |
| VITE_GROK_API_URL | No |
| VITE_ADZUNA_APP_ID | No |
| VITE_ADZUNA_APP_KEY | No |
| VITE_APP_ENV | No (set to `production`) |
| VITE_DEBUG_MODE | No (set to `false`) |

---

## Step 3: Deploy

1. Click **Deploy site** (or trigger deploy from **Deploys** tab)
2. Wait for build to complete
3. Visit the generated URL (e.g. `https://random-name-123.netlify.app`)

---

## Step 4: Custom Domain (Optional)

1. **Domain settings** → **Add custom domain**
2. Enter your domain (e.g. `uphireiq.com`)
3. Add DNS records at your registrar as instructed by Netlify
4. SSL is automatic

---

## Troubleshooting

- **Build fails:** Check build logs; ensure `base` directory is correct
- **Blank page:** Verify SPA redirects in `netlify.toml` (`/*` → `/index.html`)
- **API errors:** Ensure all env vars are set in Netlify (they are not read from `.env` in repo)
