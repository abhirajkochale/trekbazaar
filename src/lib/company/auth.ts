import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";

/**
 * Company identity resolution.
 *
 * Rule: one authenticated company user must be linked to exactly one company
 * (auth.users.id -> companies.owner_id). This module is the single source of
 * truth for resolving that link. It never throws a raw Supabase error into the
 * Company Portal; instead it returns a discriminated CompanyContext so callers
 * (and the layout) can render a controlled state.
 */
export type CompanyContext =
  | { status: "unauthenticated" }
  | { status: "no-company"; user: User }
  | { status: "multiple-companies"; user: User }
  | { status: "ok"; user: User; company: Company; companyId: string };

export async function getCompanyContext(): Promise<CompanyContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "unauthenticated" };

  // Fetch up to 2 rows so we can deterministically detect the impossible
  // "duplicate owner" state without relying on .single()/.maybeSingle()
  // error-code parsing.
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .limit(2);

  if (error) {
    // Fail closed and graceful — never surface a raw DB error to the portal.
    console.error("getCompanyContext: failed to resolve company:", error.message);
    return { status: "no-company", user };
  }

  const rows = (data ?? []) as Company[];
  if (rows.length === 0) return { status: "no-company", user };
  if (rows.length > 1) return { status: "multiple-companies", user };

  return { status: "ok", user, company: rows[0], companyId: rows[0].id };
}

/**
 * Backwards-compatible helper used across the company data layer. Returns the
 * company id only when the user is cleanly linked to exactly one company,
 * otherwise null (callers already treat null as "no access" / empty state).
 */
export async function getCompanyId(): Promise<string | null> {
  const ctx = await getCompanyContext();
  return ctx.status === "ok" ? ctx.companyId : null;
}
