import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Trek, Region, Departure } from "@/lib/types";

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
  return (data ?? []).map((t: any) => ({
    ...t,
    gallery: t.gallery_images || [],
  })) as Trek[];
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

    if (error || !data) {
      if (error) console.error(`Failed to load trek "${slug}":`, error.message);
      return null;
    }

    const trek = {
      ...data,
      gallery: data.gallery_images || [],
    } as Trek;

    // Fetch upcoming and full departures
    const { data: departures } = await supabase
      .from("departures")
      .select("*")
      .eq("trek_id", trek.id)
      .eq("is_active", true)
      .in("status", ["Upcoming", "Full"])
      .order("departure_date", { ascending: true })
      .limit(5);

    trek.departures = (departures || []) as unknown as Departure[];

    return trek;
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

  return (related ?? []).map((t: any) => ({
    ...t,
    gallery: t.gallery_images || [],
  })) as Trek[];
});

export const getRegionBySlug = cache(async (slug: string): Promise<Region | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("regions")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  return (data as Region | null) ?? null;
});

export const getAllRegions = cache(async (): Promise<Region[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("regions")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  return (data ?? []) as Region[];
});

export const getTreksByRegion = cache(async (regionSlug: string): Promise<Trek[]> => {
  const supabase = await createClient();
  
  // Notice we query the treks table where region (string) matches the slug,
  // or you can match the actual region name. Given the DB has region names 
  // (e.g. 'Uttarakhand'), but the URL is a slug, we first fetch the region to get its exact Name
  // or we query directly if they match.
  // We'll map the slug back to the Name via getRegionBySlug to be safe, 
  // because treks.region currently stores the readable name.
  
  const region = await getRegionBySlug(regionSlug);
  if (!region) return [];

  const { data } = await supabase
    .from("treks")
    .select("*")
    .eq("status", "active")
    .eq("region", region.name)
    .order("created_at", { ascending: false });

  return (data ?? []).map((t: any) => ({
    ...t,
    gallery: t.gallery_images || [],
  })) as Trek[];
});
