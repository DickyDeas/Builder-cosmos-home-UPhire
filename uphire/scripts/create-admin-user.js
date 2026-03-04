#!/usr/bin/env node

/**
 * One-time script to create the UPhireIQ admin user.
 * Run: UPHIRE_ADMIN_EMAIL=richard.deas@uphireiq.com UPHIRE_ADMIN_PASSWORD=YourPassword node scripts/create-admin-user.js
 *
 * IMPORTANT: Do not commit the password. Run once, then unset the env var.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.UPHIRE_ADMIN_EMAIL || "richard.deas@uphireiq.com";
const password = process.env.UPHIRE_ADMIN_PASSWORD;

if (!supabaseUrl || !serviceKey) {
  console.error("✗ Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!password) {
  console.error("✗ Set UPHIRE_ADMIN_PASSWORD when running this script");
  console.error("  Example: UPHIRE_ADMIN_PASSWORD=YourPassword node scripts/create-admin-user.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "UPhireIQ Admin" },
  });

  if (error) {
    if (error.message?.includes("already been registered")) {
      console.log("✓ Admin user already exists:", email);
      return;
    }
    console.error("✗ Error creating admin user:", error.message);
    process.exit(1);
  }

  console.log("✓ Admin user created:", email);
  console.log("  User ID:", data.user?.id);

  // Ensure profile exists with enterprise plan (for is_uphire_staff RPC path)
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email,
      full_name: "UPhireIQ Admin",
      subscription_plan: "enterprise",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (profileError) {
    console.warn("  Note: Profile upsert failed (may not exist yet):", profileError.message);
  } else {
    console.log("  Profile updated with enterprise plan");
  }

  console.log("\nNext: Set UPHIRE_STAFF_EMAILS=" + email + " in Netlify env vars");
}

main();
