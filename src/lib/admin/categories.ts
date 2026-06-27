import { createAdminClient } from '@/lib/supabase/admin';
import type { MasterTrekCategory } from '@/lib/types';
import { slugify } from '@/lib/format';

export interface CategoryWithStats extends MasterTrekCategory {
  master_treks_count: number;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  totalMasterTreks: number;
}

export async function getCategoryStats(): Promise<CategoryStats> {
  const supabase = createAdminClient();
  
  const [
    { count: totalCategories },
    { count: activeCategories },
    { count: totalMasterTreks }
  ] = await Promise.all([
    supabase.from("master_trek_categories").select("*", { count: "exact", head: true }),
    supabase.from("master_trek_categories").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("master_treks").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalCategories: totalCategories || 0,
    activeCategories: activeCategories || 0,
    totalMasterTreks: totalMasterTreks || 0,
  };
}

export async function getMasterTrekCategories(
  searchQuery?: string,
  sortBy: string = "created_at"
): Promise<CategoryWithStats[]> {
  const supabase = createAdminClient();
  
  let query = supabase.from("master_trek_categories").select("*");

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

  const { data: categories, error } = await query;
  if (error) throw error;

  // Fetch all master treks to count per category
  const { data: masterTreks } = await supabase.from("master_treks").select("category_id");
  
  const countMap: Record<string, number> = {};
  masterTreks?.forEach(t => {
    if (t.category_id) {
      countMap[t.category_id] = (countMap[t.category_id] || 0) + 1;
    }
  });

  const categoriesWithStats = (categories as MasterTrekCategory[]).map(cat => ({
    ...cat,
    master_treks_count: countMap[cat.id] || 0
  }));

  if (sortBy === "trek_count") {
    return categoriesWithStats.sort((a, b) => b.master_treks_count - a.master_treks_count);
  }

  return categoriesWithStats;
}

export async function createMasterTrekCategory(formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const status = formData.get("status")?.toString() || "draft";
  
  if (!name) throw new Error("Name is required");
  const slug = slugify(rawSlug || name);

  const { data: existing } = await supabase.from("master_trek_categories").select("id").eq("slug", slug).maybeSingle();
  if (existing) throw new Error("A category with this slug already exists.");

  const { error } = await supabase.from("master_trek_categories").insert({
    name, slug, description, status
  });

  if (error) throw new Error(error.message);
}

export async function updateMasterTrekCategory(id: string, formData: FormData) {
  const supabase = createAdminClient();
  
  const name = formData.get("name")?.toString().trim();
  const rawSlug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const status = formData.get("status")?.toString() || "draft";
  
  if (!name) throw new Error("Name is required");
  const slug = slugify(rawSlug || name);

  const { data: existing } = await supabase
    .from("master_trek_categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) throw new Error("A category with this slug already exists.");

  const { error } = await supabase.from("master_trek_categories").update({
    name, slug, description, status, updated_at: new Date().toISOString()
  }).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteMasterTrekCategory(id: string) {
  const supabase = createAdminClient();
  
  const { data: cat } = await supabase.from("master_trek_categories").select("name").eq("id", id).single();
  if (!cat) throw new Error("Category not found");

  const { count } = await supabase
    .from("master_treks")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    throw new Error(`Cannot delete category. There are ${count} Master Treks assigned to it.`);
  }

  const { error } = await supabase.from("master_trek_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
