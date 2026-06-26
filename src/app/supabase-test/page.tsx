import { createClient } from "@/lib/supabase/server";

/**
 * Temporary connection-check page. It initializes the server-side
 * Supabase client and makes a harmless auth call (no tables required).
 * Delete this page once the connection is confirmed.
 */
export default async function SupabaseTestPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let status: string;
  try {
    const supabase = await createClient();
    // getSession() does not require any tables; it just exercises the client.
    const { error } = await supabase.auth.getSession();
    status = error
      ? `Client initialized, but auth call returned: ${error.message}`
      : "✅ Supabase client initialized and reached the API successfully.";
  } catch (err) {
    status =
      "❌ Failed to initialize Supabase client: " +
      (err instanceof Error ? err.message : String(err));
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center font-sans">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Supabase Connection Test
      </h1>
      <p className="max-w-md text-zinc-700">{status}</p>
      <dl className="text-sm text-zinc-500">
        <div>
          NEXT_PUBLIC_SUPABASE_URL:{" "}
          {url && url !== "your-project-url-here" ? "set" : "missing/placeholder"}
        </div>
        <div>
          NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasKey ? "set" : "missing"}
        </div>
      </dl>
    </main>
  );
}
