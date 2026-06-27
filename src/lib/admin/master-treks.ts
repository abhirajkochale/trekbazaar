import { createAdminClient } from '@/lib/supabase/admin';
import type { MasterTrek } from '@/lib/types';
import { slugify } from '@/lib/format';

export interface MasterTrekStats {
  total: number;
  active: number;
  linkedPackages: number;
}

export async function getMasterTreksStats(): Promise<MasterTrekStats> {
  const supabase = createAdminClient();
  
  const [
    { count: total },
    { count: active },
    { count: linkedPackages }
  ] = await Promise.all([
    supabase.from("master_treks").select("*", { count: "exact", head: true }),
    supabase.from("master_treks").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("treks").select("*", { count: "exact", head: true }).not("master_trek_id", "is", null),
  ]);

  return {
    total: total || 0,
    active: active || 0,
    linkedPackages: linkedPackages || 0,
  };
}

export async function getMasterTreks(searchQuery?: string, sortBy: string = "created_at") {
  const supabase = createAdminClient();
  let query = supabase
    .from('master_treks')
    .select(`
      *,
      category:master_trek_categories(name),
      region:regions(name)
    `);

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`);
  }

  if (sortBy === "name_asc") {
    query = query.order("name", { ascending: true });
  } else if (sortBy === "name_desc") {
    query = query.order("name", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching master treks:", error);
    return [];
  }

  // Count linked packages for each master trek
  const { data: treks } = await supabase.from("treks").select("master_trek_id").not("master_trek_id", "is", null);
  const linkCounts: Record<string, number> = {};
  treks?.forEach(t => {
    if (t.master_trek_id) {
      linkCounts[t.master_trek_id] = (linkCounts[t.master_trek_id] || 0) + 1;
    }
  });

  const masterTreksWithStats = (data as MasterTrek[]).map(mt => ({
    ...mt,
    packages_count: linkCounts[mt.id] || 0
  }));

  if (sortBy === "package_count") {
    return masterTreksWithStats.sort((a, b) => b.packages_count - a.packages_count);
  }

  return masterTreksWithStats;
}

export async function getMasterTrekById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_treks')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return data as MasterTrek;
}

export async function saveMasterTrek(payload: Partial<MasterTrek>) {
  const supabase = createAdminClient();
  
  if (!payload.name) throw new Error("Name is required");
  const slug = slugify(payload.slug || payload.name);

  // Check unique slug
  let query = supabase.from("master_treks").select("id").eq("slug", slug);
  if (payload.id) {
    query = query.neq("id", payload.id);
  }
  const { data: existing } = await query.maybeSingle();

  if (existing) {
    throw new Error("A Master Trek with this slug already exists.");
  }

  const dataToSave = {
    name: payload.name,
    slug,
    category_id: payload.category_id || null,
    region_id: payload.region_id || null,
    country: payload.country || "India",
    state: payload.state || null,
    difficulty: payload.difficulty || null,
    duration_min: payload.duration_min ? parseInt(payload.duration_min as unknown as string) : null,
    duration_max: payload.duration_max ? parseInt(payload.duration_max as unknown as string) : null,
    altitude: payload.altitude || null,
    best_season: payload.best_season || null,
    overview: payload.overview || null,
    cover_image: payload.cover_image || null,
    gallery: payload.gallery || [],
    highlights: payload.highlights || [],
    seo_title: payload.seo_title || null,
    seo_description: payload.seo_description || null,
    status: payload.status || "draft",
    updated_at: new Date().toISOString()
  };

  if (payload.id) {
    const { data, error } = await supabase
      .from('master_treks')
      .update(dataToSave)
      .eq('id', payload.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as MasterTrek;
  } else {
    const { data, error } = await supabase
      .from('master_treks')
      .insert(dataToSave)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as MasterTrek;
  }
}

export async function archiveMasterTrek(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('master_treks')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteMasterTrek(id: string) {
  const supabase = createAdminClient();
  
  // Check if there are linked packages
  const { count } = await supabase
    .from("treks")
    .select("*", { count: "exact", head: true })
    .eq("master_trek_id", id);

  if (count && count > 0) {
    throw new Error(`Cannot delete Master Trek. It has ${count} linked Company Packages. Please archive it instead.`);
  }

  const { error } = await supabase.from("master_treks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
