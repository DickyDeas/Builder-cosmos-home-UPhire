# Subpath Integration – uphireiq.com/app

The UPhire platform is configured to run at **uphireiq.com/app** so users can access it via an "Access Platform" button on the main website.

---

## For the Marketing Website

Add an **"Access Platform"** button that links to:

```
https://uphireiq.com/app
```

Or for relative links (when on uphireiq.com):

```
/app
```

Example HTML:

```html
<a href="/app" class="btn">Access Platform</a>
```

---

## App URLs

| Page        | URL                          |
|-------------|------------------------------|
| Home        | uphireiq.com/app             |
| Login       | uphireiq.com/app/login       |
| Help        | uphireiq.com/app/help        |
| Support     | uphireiq.com/app/support     |
| Apply (job)  | uphireiq.com/app/apply/:id   |
| Screening   | uphireiq.com/app/screening/:id |

---

## Deployment (Combined Site)

When the UPhire app and marketing site are deployed together:

1. **Marketing site** builds to the publish root (e.g. `index.html`, `/products`, etc.)
2. **UPhire app** builds to `dist/app/` (index.html, assets)
3. **Publish directory** includes both, e.g.:
   - `/index.html` (marketing)
   - `/app/index.html` (UPhire)
   - `/app/assets/*` (UPhire assets)

4. **Netlify redirects** (in this repo's `netlify.toml`):
   - `/app` → `/app/index.html`
   - `/app/*` → `/app/index.html` (SPA fallback)

---

## Environment Variable

Set **VITE_APP_URL** to `https://uphireiq.com/app` in production so generated links (e.g. screening invites) use the correct base URL.
