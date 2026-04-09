# Prompt: AI developer — Access Platform (Option 2) until domain merge

Copy everything below the dashed line into your agent.

---

**Role:** You are a developer with access to the **marketing website** repository (e.g. `DickyDeas/UPHire-20IQ-20Website`), the CMS/Builder project if applicable, and optionally **Netlify** for redirects.

**Problem:**  
Production domain **`uphireiq.com`** is attached to a Netlify site that **only hosts marketing** and does **not** deploy UPhire’s **`uphire/api/*.js`** functions. The full app and APIs live on a **different** Netlify site (e.g. **`https://uphiresystem.netlify.app`**). Users who open **`https://uphireiq.com/app`** get **`/api/*` 404** and Market Intelligence falls back to **estimated data**.

**Goal (Option 2 — no apex migration yet):**  
Ensure anyone clicking **“Access Platform”** lands on the **app Netlify URL** where **`/api/*`** works. Optionally add redirects so old **`uphireiq.com/app`** links don’t strand users on the broken host.

**Tasks:**

1. **Find the “Access Platform” control** in the marketing codebase (HTML, React, Builder component, or CMS link).  
2. **Set its `href`** to the canonical app entry:  
   **`https://uphiresystem.netlify.app/app`**  
   (If the team later adds **`app.uphireiq.com`** pointing to the same Netlify site, update this URL to that hostname.)  
3. **Search** the marketing repo for other links to **`/app`**, **`/app/`**, or **`uphireiq.com/app`** and update them to the same **absolute** app URL unless intentionally internal.  
4. **Optional but recommended:** On the **marketing** Netlify site (`uphireiq`), add **redirect rules** so **`/app`** and **`/app/*`** **301/302** to **`https://uphiresystem.netlify.app/app`** (preserve path if the app uses deep links, e.g. redirect `/app/login` → `https://uphiresystem.netlify.app/app/login`). Use Netlify `_redirects` or `netlify.toml` **on the marketing site** only.  
5. **Do not** remove **`uphireiq.com`** from marketing until stakeholders agree. This task is **link + optional redirects** only.  
6. **Verify:** After deploy, from the marketing homepage, click **Access Platform** → URL bar should show **`uphiresystem.netlify.app`** (or your **`app.`** subdomain). Open **Market Intelligence** → DevTools **Network** → **`/api/adzuna-proxy`** should **not** be **404**.  
7. **Coordinate:** Confirm **environment variables** (Adzuna, Grok, Supabase, etc.) are set on the **app** Netlify site (**`uphiresystem`**), not only on marketing — that’s required for live data, not merely for routing.

**Deliverables:**  
- PR or commit with updated links;  
- If redirects added, file + snippet;  
- Short note of **before/after** URL for the button.

**Out of scope:** Moving **`uphireiq.com`** apex to the app site (that’s Option A / separate task).

---

_End of prompt._
