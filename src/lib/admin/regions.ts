import { createAdminClient } from "@/lib/supabase/admin";
import type { Region } from "@/lib/types";
import { slugify } from "@/lib/format";

export interface RegionWithStats extends Region {
  treks_count: number;
}

export interface RegionStats {
  totalRegions: number;
  activeRegions: number;
  totalTreks: number;
  avgTrekPrice: number;
}

export async function getRegionStats(): Promise<RegionStats> {
  const supabase = createAdminClient();
  
  const [
    { count: totalRegions },
    { count: activeRegions },
    { count: totalTreks, data: treksData }
  ] = await Promise.all([
    supabase.from("regions").select("*", { count: "exact", head: true }),
    supabase.from("regions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("treks").select("price_per_person", { count: "exact" }),
  ]);

  let avgTrekPrice = 0;
  if (treksData && treksData.length > 0) {
    avgTrekPrice = treksData.reduce((acc, t) => acc + (t.price_per_person || 0), 0) / treksData.length;
  }

  return {
    totalRegions: totalRegions || 0,
    activeRegions: activeRegions || 0,
    totalTreks: totalTreks || 0,
    avgTrekPrice: Math.round(avgTrekPrice),
  };
}

export async function getRegions(
  searchQuery?: string,
  sortBy: string = "created_at"
): Promise<RegionWithStats[]> {
  const supabase = createAdminClient();
  
  let query = supabase.from("regions").select("*");

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`);
  }

  // Handle sorting
  if (sortBy === "name_asc") {
    query = query.order("name", { ascending: true });
  } else if (sortBy === "name_desc") {
    query = query.order("name", { ascending: false });
  } else {
    // Default to newest
    query = query.order("created_at", { ascending: false });
  }

  const { data: regions, error: regionsError } = await query;
  if (regionsError) throw regionsError;

  // Fetch all treks to count per region
  // Since regions map to treks by region name, we do a quick group by in JS for efficiency on small datasets
  // Alternatively, we could do an RPC, but JS is fine for our current scale.
  const { data: treks } = await supabase.from("treks").select("region");
  
  const trekCounts: Record<string, number> = {};
  treks?.forEach(t => {
    trekCounts[t.region] = (trekCounts[t.region] || 0) + 1;
  });

  const regionsWithStats = (regions as Region[]).map(region => ({
    ...region,
    treks_count: trekCounts[region.name] || 0
  }));

  if (sortBy === "trek_count") {
    return regionsWithStats.sort((a, b) => b.treks_count - a.treks_count);
  }

  return regionsWithStats;
}

export async function createRegion(formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const hero_image_url = formData.get("hero_image_url")?.toString().trim() || null;
  const best_season = formData.get("best_season")?.toString().trim() || null;
  const weather = formData.get("weather")?.toString().trim() || null;
  const altitude_range = formData.get("altitude_range")?.toString().trim() || null;
  const status = formData.get("status")?.toString() || "draft";
  
  // Parse array fields (split by comma if needed, or assume they come as JSON. 
  // Let's assume standard textarea separated by newlines for simplicity)
  const nearby_attractions = formData.get("nearby_attractions")?.toString().trim()
    .split('\n').map(s => s.trim()).filter(Boolean) || [];
  
  if (!name) throw new Error("Name is required");
  
  const slug = slugify(rawSlug || name);

  // Check unique slug
  const { data: existing } = await supabase.from("regions").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    throw new Error("A region with this slug already exists.");
  }

  const { error } = await supabase.from("regions").insert({
    name,
    slug,
    description,
    hero_image_url,
    best_season,
    weather,
    altitude_range,
    nearby_attractions,
    status
  });

  if (error) throw new Error(error.message);
}

export async function updateRegion(id: string, formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const hero_image_url = formData.get("hero_image_url")?.toString().trim() || null;
  const best_season = formData.get("best_season")?.toString().trim() || null;
  const weather = formData.get("weather")?.toString().trim() || null;
  const altitude_range = formData.get("altitude_range")?.toString().trim() || null;
  const status = formData.get("status")?.toString() || "draft";
  
  const nearby_attractions = formData.get("nearby_attractions")?.toString().trim()
    .split('\n').map(s => s.trim()).filter(Boolean) || [];
  
  if (!name) throw new Error("Name is required");
  
  const slug = slugify(rawSlug || name);

  // Check unique slug excluding current
  const { data: existing } = await supabase
    .from("regions")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    throw new Error("A region with this slug already exists.");
  }

  const { error } = await supabase.from("regions").update({
    name,
    slug,
    description,
    hero_image_url,
    best_season,
    weather,
    altitude_range,
    nearby_attractions,
    status,
    updated_at: new Date().toISOString()
  }).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteRegion(id: string) {
  const supabase = createAdminClient();
  
  // Get region name to check treks
  const { data: region } = await supabase.from("regions").select("name").eq("id", id).single();
  if (!region) throw new Error("Region not found");

  // Check if treks exist
  const { count } = await supabase
    .from("treks")
    .select("*", { count: "exact", head: true })
    .eq("region", region.name);

  if (count && count > 0) {
    throw new Error(`Cannot delete region. There are ${count} treks assigned to this region.`);
  }

  const { error } = await supabase.from("regions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
