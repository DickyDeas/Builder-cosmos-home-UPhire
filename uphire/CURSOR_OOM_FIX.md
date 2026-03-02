# Cursor OOM Error 536870904 – Fixes

The error code **536870904** is a known Cursor IDE bug on Windows. The renderer process hits a ~4GB memory limit, and recent versions have an OpenTelemetry memory leak.

## Quick fixes (try in order)

### 1. Reduce memory usage
- **Start a new chat** when the current one gets large (avoids context buildup)
- **Close unused files** – especially `Index.tsx` when not editing it
- `.cursorignore` is already set up to exclude `node_modules`, `dist`, and build folders

### 2. Launch Cursor with more memory
Create a shortcut or use the command line:

```powershell
cursor --js-flags="--max-old-space-size=8192"
```

Or edit your Cursor shortcut:
- Right‑click Cursor shortcut → Properties
- In **Target**, append: ` --js-flags="--max-old-space-size=8192"`
- Example: `"C:\Users\...\Cursor.exe" --js-flags="--max-old-space-size=8192"`

### 3. Check for OpenTelemetry leak
1. In Cursor: `Ctrl+Shift+P` → **Developer: Toggle Developer Tools**
2. Open the **Console** tab
3. Look for `[otel.error]` or `OTLPExporterError`

**If you see these errors:**
- Downgrade to Cursor **2.3.34** (or 2.3.35) from [cursor.com/download](https://cursor.com/download)
- After installing: **Settings → Application → Update → Mode: "none"** (disable auto-update)

### 4. Disable extensions
Run Cursor with extensions disabled to see if one is causing the crash:

```powershell
cursor --disable-extensions
```

### 5. Monitor memory
- `Ctrl+Shift+P` → **Developer: Open Process Explorer**
- Watch the **renderer** process – if it approaches ~3.8–4GB, close large files or start a new chat

---

## Project-specific notes

- `Index.tsx` (~9,500 lines) has been split into `uphire/types.ts`, `uphire/utils.ts`, and `uphire/data.ts` to reduce size
- Avoid keeping `Index.tsx` open when not actively editing it
- For heavy edits, work in smaller sessions and save often
