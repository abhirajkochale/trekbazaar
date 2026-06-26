import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Trek } from "@/lib/types";

/**
 * Fetch all active treks, newest first.
 * Returns [] on error so pages render an empty state instead of crashing.
 */
export const getActiveTreks = cache(async (): Promise<Trek[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("treks")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load treks:", error.message);
    return [];
  }
  return (data ?? []) as Trek[];
});

/**
 * Fetch a single active trek by slug, or null if none matches.
 * Wrapped in React's cache() so the detail page and its generateMetadata
 * share one query per request instead of hitting Supabase twice.
 */
export const getTrekBySlug = cache(
  async (slug: string): Promise<Trek | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("treks")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error(`Failed to load trek "${slug}":`, error.message);
      return null;
    }
    return (data as Trek | null) ?? null;
  }
);
