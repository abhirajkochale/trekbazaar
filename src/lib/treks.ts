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

/**
 * Fetch related treks based on priority:
 * 1. Same region
 * 2. Exclude current trek
 * Fallback to newest if < 3 results.
 */
export const getRelatedTreks = cache(async (currentTrek: Trek): Promise<Trek[]> => {
  const supabase = await createClient();
  
  // 1. Try to get treks in the same region
  let { data: related } = await supabase
    .from("treks")
    .select("*")
    .eq("status", "active")
    .neq("id", currentTrek.id)
    .eq("region", currentTrek.region)
    .order("created_at", { ascending: false })
    .limit(4);

  // 2. If we don't have enough, fetch fallback (newest active treks)
  if (!related || related.length < 3) {
    const { data: fallback } = await supabase
      .from("treks")
      .select("*")
      .eq("status", "active")
      .neq("id", currentTrek.id)
      .order("created_at", { ascending: false })
      .limit(4 - (related?.length || 0));

    if (fallback) {
      // Combine and deduplicate just in case
      const combined = [...(related || []), ...fallback];
      const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
      related = unique.slice(0, 4);
    }
  }

  return (related ?? []) as Trek[];
});
