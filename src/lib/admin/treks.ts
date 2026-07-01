import { createAdminClient } from "@/lib/supabase/admin";
import type { Trek } from "@/lib/types";
import { slugify } from "@/lib/format";

export interface TrekStats {
  totalTreks: number;
  activeTreks: number;
  draftTreks: number;
  avgPrice: number;
}

export async function getTrekStats(): Promise<TrekStats> {
  const supabase = createAdminClient();
  
  const [
    { count: totalTreks, data: allTreks },
    { count: activeTreks },
    { count: draftTreks }
  ] = await Promise.all([
    supabase.from("treks").select("price_per_person", { count: "exact" }),
    supabase.from("treks").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("treks").select("*", { count: "exact", head: true }).eq("status", "draft")
  ]);

  let avgPrice = 0;
  if (allTreks && allTreks.length > 0) {
    avgPrice = allTreks.reduce((acc, t) => acc + (t.price_per_person || 0), 0) / allTreks.length;
  }

  return {
    totalTreks: totalTreks || 0,
    activeTreks: activeTreks || 0,
    draftTreks: draftTreks || 0,
    avgPrice: Math.round(avgPrice),
  };
}

export async function getTreks(
  searchQuery?: string,
  regionFilter?: string,
  difficultyFilter?: string,
  statusFilter?: string,
  masterTrekFilter?: string,
  sortBy: string = "updated_desc"
): Promise<Trek[]> {
  const supabase = createAdminClient();
  
  let query = supabase.from("treks").select("*, master_treks(name)");

  if (searchQuery) {
    const { data: mtData } = await supabase.from('master_treks').select('id').ilike('name', `%${searchQuery}%`);
    const mtIds = mtData?.map(d => d.id) || [];
    
    if (mtIds.length > 0) {
      query = query.or(`title.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,master_trek_id.in.(${mtIds.join(',')})`);
    } else {
      query = query.or(`title.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`);
    }
  }
  if (regionFilter && regionFilter !== "all") {
    query = query.eq("region", regionFilter);
  }
  if (difficultyFilter && difficultyFilter !== "all") {
    query = query.eq("difficulty", difficultyFilter);
  }
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (masterTrekFilter && masterTrekFilter !== "all") {
    if (masterTrekFilter === "linked") {
      query = query.not("master_trek_id", "is", null);
    } else if (masterTrekFilter === "unlinked") {
      query = query.is("master_trek_id", null);
    } else {
      query = query.eq("master_trek_id", masterTrekFilter);
    }
  }

  // Handle sorting
  switch (sortBy) {
    case "created_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price_per_person", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_per_person", { ascending: false });
      break;
    case "duration_asc":
      query = query.order("duration_days", { ascending: true });
      break;
    case "name_asc":
      query = query.order("title", { ascending: true });
      break;
    case "updated_desc":
    default:
      query = query.order("updated_at", { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Map gallery_images to gallery
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map(t => ({
    ...t,
    gallery: t.gallery_images || [],
  })) as Trek[];
}

export async function getTrek(id: string): Promise<Trek> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("treks").select("*").eq("id", id).single();
  if (error) throw error;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = data as any;
  return {
    ...t,
    gallery: t.gallery_images || [],
  } as Trek;
}

export async function createTrek(trekData: Partial<Trek>): Promise<Trek> {
  const supabase = createAdminClient();
  
  if (!trekData.title) throw new Error("Title is required");
  if (!trekData.master_trek_id) throw new Error("Master Trek is required");
  if (!trekData.slug) trekData.slug = slugify(trekData.title);
  
  if (trekData.price_per_person && trekData.price_per_person < 0) {
    throw new Error("Price must be a positive number");
  }
  if (trekData.duration_days && trekData.duration_days <= 0) {
    throw new Error("Duration must be a positive number");
  }

  // Unique slug check
  const { data: existing } = await supabase
    .from("treks")
    .select("id")
    .eq("slug", trekData.slug)
    .maybeSingle();

  if (existing) throw new Error("A trek with this slug already exists.");

  const { data: activeMasterTrek } = await supabase
    .from("master_treks")
    .select("id")
    .eq("id", trekData.master_trek_id)
    .eq("status", "active")
    .maybeSingle();

  if (!activeMasterTrek) throw new Error("Selected Master Trek must be active and exist.");

  const payload = { ...trekData } as any;
  if ('gallery' in payload) {
    payload.gallery_images = payload.gallery;
    delete payload.gallery;
  }

  const { data, error } = await supabase.from("treks").insert([payload]).select().single();
  if (error) throw new Error(error.message);
  
  const t = data as any;
  return {
    ...t,
    gallery: t.gallery_images || [],
  } as Trek;
}

export async function updateTrek(id: string, trekData: Partial<Trek>): Promise<Trek> {
  const supabase = createAdminClient();
  
  if (trekData.title && !trekData.slug) {
    trekData.slug = slugify(trekData.title);
  }
  if ('master_trek_id' in trekData && !trekData.master_trek_id) {
    throw new Error("Master Trek is required");
  }

  if (trekData.price_per_person && trekData.price_per_person < 0) {
    throw new Error("Price must be a positive number");
  }
  if (trekData.duration_days && trekData.duration_days <= 0) {
    throw new Error("Duration must be a positive number");
  }

  if (trekData.slug) {
    const { data: existing } = await supabase
      .from("treks")
      .select("id")
      .eq("slug", trekData.slug)
      .neq("id", id)
      .maybeSingle();

    if (existing) throw new Error("A trek with this slug already exists.");
  }

  if (trekData.master_trek_id) {
    const { data: activeMasterTrek } = await supabase
      .from("master_treks")
      .select("id")
      .eq("id", trekData.master_trek_id)
      .eq("status", "active")
      .maybeSingle();

    if (!activeMasterTrek) throw new Error("Selected Master Trek must be active and exist.");
  }

  const payload = {
    ...trekData,
    updated_at: new Date().toISOString()
  } as any;
  
  if ('gallery' in payload) {
    payload.gallery_images = payload.gallery;
    delete payload.gallery;
  }
  
  // Clean up 'id' if it accidentally got passed in Partial<Trek>
  if ('id' in payload) delete payload.id;

  const { data, error } = await supabase
    .from("treks")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = data as any;
  return {
    ...t,
    gallery: t.gallery_images || [],
  } as Trek;
}

export async function deleteTrek(id: string): Promise<void> {
  const supabase = createAdminClient();
  // We don't check for enquiries or bookings strictly here right now. 
  // If we had foreign keys, it would fail naturally or cascade.
  const { error } = await supabase.from("treks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateTrek(id: string): Promise<string> {
  const supabase = createAdminClient();
  
  const original = await getTrek(id);
  
  // Create duplicate data
  const newTitle = `Copy of ${original.title}`;
  const newSlug = slugify(newTitle + '-' + Date.now().toString().slice(-4));
  
  // Remove fields that shouldn't be duplicated directly
  const duplicatedData: Partial<Trek> = { ...original };
  delete duplicatedData.id;
  delete duplicatedData.created_at;
  delete duplicatedData.updated_at;
  
  duplicatedData.title = newTitle;
  duplicatedData.slug = newSlug;
  duplicatedData.status = 'draft';

  const { data, error } = await supabase.from("treks").insert([duplicatedData]).select().single();
  if (error) throw new Error(error.message);
  
  return data.id;
}

export async function togglePublished(id: string, currentStatus: string): Promise<void> {
  const supabase = createAdminClient();
  const newStatus = currentStatus === 'active' ? 'draft' : 'active';
  
  const { error } = await supabase
    .from("treks")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);
    
  if (error) throw new Error(error.message);
}
