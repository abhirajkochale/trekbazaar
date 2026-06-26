import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the service_role key. It BYPASSES Row Level
 * Security, so it must only ever be used on the server (Server Components
 * and Server Actions). Never import this into a Client Component, and never
 * expose the service_role key with a NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
