# UPhire Codebase Audit Report

**Date:** March 4, 2025  
**Scope:** `uphire/src/` – main app code, routes, links, API calls, and orphaned code

---

## 1. Dead Links & Broken Paths

### 1.1 Screening Chat Link – Wrong Base Path (CRITICAL)

| Item | Details |
|------|---------|
| **File** | `src/services/screeningChatService.ts` |
| **Line** | 239–240 |
| **Issue** | The screening link sent to candidates is `${baseUrl}/screening/${sessionId}` but the app uses `basename="/app"`, so the route is `/app/screening/:sessionId`. Candidates clicking the email link land on a 404. |
| **Severity** | **Critical** |
| **Recommendation** | Change to `${baseUrl}/app/screening/${sessionId}` (or use a path that includes the app base). Ensure `VITE_APP_URL` in production includes the `/app` segment if used. |

```ts
// Current (broken):
const link = `${baseUrl}/screening/${sessionId}`;

// Fix:
const link = `${baseUrl}/app/screening/${sessionId}`;
```

### 1.2 Support Phone Link Fallback (INFO)

| Item | Details |
|------|---------|
| **File** | `src/pages/SupportTickets.tsx` |
| **Line** | 366 |
| **Issue** | When `contactConfig.supportPhone` is empty, `href` is `"#"`, which is a no-op link. |
| **Severity** | **Info** |
| **Recommendation** | Render plain text instead of a link when no phone number is configured, or use `aria-disabled` and `role="button"` if keeping the link for layout. |

### 1.3 Internal Routes – Verified OK

All internal `Link` and `navigate()` targets match defined routes:

| Target | Route Exists | Files |
|--------|--------------|-------|
| `/` | ✅ | Index.tsx, LoginPage, NotFound, SupportTickets, HelpCenter, SubscriptionPage |
| `/login` | ✅ | AuthGuard, Index, LoginPage |
| `/help` | ✅ | Index, SupportTickets |
| `/support` | ✅ | Index, HelpCenter |
| `/subscription` | ✅ | Index |
| `/apply/:roleId` | ✅ | App.tsx |
| `/apply/:tenantSlug/:jobId` | ✅ | App.tsx |
| `/screening/:sessionId` | ✅ | App.tsx |

---

## 2. Inactive / Unused Functions

### 2.1 `jobBoardService` – Never Imported (WARNING)

| Item | Details |
|------|---------|
| **File** | `src/services/jobBoardService.ts` |
| **Issue** | `postJobToBoard()` is never imported or called. Index.tsx uses `postToJobBoards` as form data only, not this service. |
| **Severity** | **Warning** |
| **Recommendation** | Either wire job board posting to `postJobToBoard()` where appropriate, or remove the service if the feature is deprecated. |

### 2.2 `dataExportService` – GDPR APIs Unused (WARNING)

| Item | Details |
|------|---------|
| **File** | `src/services/dataExportService.ts` |
| **Issue** | `exportCandidateData()` and `purgeCandidateData()` are never imported. Backend endpoints exist (`/api/export-candidate-data`, `/api/purge-candidate-data`) but no UI calls them. |
| **Severity** | **Warning** |
| **Recommendation** | Add UI for GDPR right-to-access and right-to-erasure (e.g. in candidate profile or settings) and call these services. |

### 2.3 `encryptMetadata` – Unused (INFO)

| Item | Details |
|------|---------|
| **File** | `src/lib/encryptMetadata.ts` |
| **Issue** | `encryptMetadata()` is never imported. |
| **Severity** | **Info** |
| **Recommendation** | Use where metadata encryption is required, or remove if obsolete. |

### 2.4 `fetchJsonWithTimeout` – Unused (INFO)

| Item | Details |
|------|---------|
| **File** | `src/lib/apiClient.ts` |
| **Line** | 63 |
| **Issue** | Exported but never used; only `fetchWithTimeout` is used. |
| **Severity** | **Info** |
| **Recommendation** | Use for JSON APIs where appropriate, or remove if not needed. |

---

## 3. Unconnected Features & Placeholder Handlers

### 3.1 `alert()` Placeholders – Many Actions Do Nothing (WARNING)

| File | Lines | Description |
|------|-------|-------------|
| `Index.tsx` | 504, 544, 550, 564 | Document upload/view/download – "connect to Supabase storage when ready" |
| `Index.tsx` | 1013, 1015, 1019 | Live chat link success/failure messages |
| `Index.tsx` | 1447–1448, 4852, 4854 | Offer email sent/failed |
| `Index.tsx` | 2294, 2301, 2308, 2316 | Job description editor, view applications, share posting, close position |
| `Index.tsx` | 2471, 2543 | Job title/department validation |
| `Index.tsx` | 2647, 2654 | AI success prediction |
| `Index.tsx` | 2748, 2777, 2781 | Role create/update success/error |
| `Index.tsx` | 4160, 4173 | Bulk role update |
| `Index.tsx` | 4319, 4329, 4332, 4347, 4350 | Shortlist/hire candidate |
| `Index.tsx` | 4456 | Advanced candidate search |
| `Index.tsx` | 5242, 5244 | Add employee |
| `Index.tsx` | 5399, 5406, 5480, 5488 | Employee search, filters, documents, performance review |
| `Index.tsx` | 5573, 5711, 5718, 5725, 5733, 5759, 5770, 5783 | Document templates, view/download/edit/delete |
| `Index.tsx` | 5840 | ROI/savings report export |
| `Index.tsx` | 6229 | Outreach – select candidate and role |
| `Index.tsx` | 6652 | Add to outreach sequence |
| `Index.tsx` | 6902, 6917 | Heuristic scan |
| `Index.tsx` | 6938, 6968, 7001, 7004 | CSV import validation |
| `Index.tsx` | 7029, 7080, 7117 | Export CVs, screening |
| `Index.tsx` | 7378 | Image upload validation |
| `Index.tsx` | 7434 | Job board credentials config |
| `AnalyticsTab.tsx` | 44 | Analytics report export |
| `MarketIntelligence.tsx` | 336, 343, 350 | Market report export, create role, CSV export |

**Severity:** **Warning**  
**Recommendation:** Replace `alert()` with toast notifications and implement real behavior (Supabase, navigation, API calls) for each action.

---

## 4. Broken References & API Endpoints

### 4.1 `/api/job-board-post` – No Netlify Redirect (WARNING)

| Item | Details |
|------|---------|
| **File** | `netlify.toml` |
| **Issue** | `jobBoardService` calls `/api/job-board-post`, but `netlify.toml` has no redirect for it. The function exists at `api/job-board-post.js`. |
| **Severity** | **Warning** |
| **Recommendation** | Add redirect in `netlify.toml` (same pattern as other API routes). Note: `jobBoardService` is currently unused, so this only matters once it is wired up. |

```toml
[[redirects]]
  from = "/api/job-board-post"
  to = "/.netlify/functions/job-board-post"
  status = 200
  force = true
```

### 4.2 Vite Dev Server – job-board-post Not Proxied (INFO)

| Item | Details |
|------|---------|
| **File** | `vite.config.ts` |
| **Issue** | Vite proxies `/api/adzuna-proxy`, `/api/grok-proxy`, `/api/email-send`, `/api/audit-log`, `/api/itjobswatch-proxy` but not `/api/job-board-post`. |
| **Severity** | **Info** |
| **Recommendation** | Add a dev proxy for `/api/job-board-post` if you plan to use it locally. |

### 4.3 Apply API Base URL (INFO)

| Item | Details |
|------|---------|
| **File** | `src/pages/ApplyPage.tsx` |
| **Line** | 7, 49 |
| **Issue** | `VITE_APPLY_BASE_URL` defaults to `""`, so `apiBase` falls back to `window.location.origin`. On Netlify with `base = "uphire"`, the apply page may be at a different origin than the API. |
| **Severity** | **Info** |
| **Recommendation** | Ensure `VITE_APPLY_BASE_URL` is set in production so the apply API is called at the correct origin. |

---

## 5. Orphaned Code

### 5.1 `api/role-flags-check.js` – Unused API (INFO)

| Item | Details |
|------|---------|
| **File** | `api/role-flags-check.js` |
| **Issue** | No references in `src/`. Netlify has no redirect for it. |
| **Severity** | **Info** |
| **Recommendation** | Use it where role flags are needed, add a Netlify redirect, or remove if obsolete. |

### 5.2 `components/ui/sidebar.tsx` – Unused Component (INFO)

| Item | Details |
|------|---------|
| **File** | `src/components/ui/sidebar.tsx` |
| **Issue** | Not imported anywhere. Index.tsx uses its own sidebar implementation. |
| **Severity** | **Info** |
| **Recommendation** | Keep if planned for future use, or remove to reduce bundle size. |

### 5.3 `lib/storageUtils.ts` – Unused (INFO)

| Item | Details |
|------|---------|
| **File** | `src/lib/storageUtils.ts` |
| **Issue** | No imports found in `src/`. |
| **Severity** | **Info** |
| **Recommendation** | Use where storage utilities are needed, or remove. |

---

## 6. External Links (Verified)

| Config | Default | Used In |
|--------|---------|---------|
| `contactConfig.pricingUrl` | https://uphireiq.com/products#pricing | SubscriptionPage |
| `contactConfig.privacyUrl` | https://uphireiq.com/privacy | Index footer |
| `contactConfig.termsUrl` | https://uphireiq.com/terms | Index footer |
| `contactConfig.supportEmail` | info@uphireiq.com | SupportTickets mailto |
| `contactConfig.supportPhone` | "" | SupportTickets (fallback `#`) |

These are configurable via `.env` and point to the main site.

---

## 7. Summary

| Severity | Count | Priority |
|----------|-------|----------|
| **Critical** | 1 | Fix immediately (screening link) |
| **Warning** | 5 | Fix soon (placeholders, unused services, missing redirect) |
| **Info** | 8 | Address when convenient |

### Recommended Order of Fixes

1. ~~**Critical:** Fix screening link in `screeningChatService.ts` to include `/app` in the path.~~ ✅ Fixed
2. ~~**Warning:** Add Netlify redirect for `/api/job-board-post` if job board posting will be used.~~ ✅ Fixed
3. ~~**Warning:** Replace `alert()` placeholders with toasts and real implementations.~~ ✅ Partially fixed (key flows)
4. ~~**Warning:** Add GDPR UI for `exportCandidateData` and `purgeCandidateData`.~~ ✅ Fixed (My Business > Data & Privacy)
5. ~~**Warning:** Support phone link when no phone configured.~~ ✅ Fixed
6. **Info:** Clean up or use orphaned code (jobBoardService, encryptMetadata, role-flags-check, sidebar, storageUtils).
