import { createClient } from "@/lib/supabase/server";
import { Region } from "@/lib/types";

export async function getPublicRegions(options: { limit?: number } = {}): Promise<Region[]> {
  const supabase = await createClient();
  let query = supabase.from('regions').select('*').eq('status', 'active');
  
  if (options.limit) {
    query = query.limit(options.limit);
  }

  // We could order by popularity or created_at. Since regions might be manually curated, let's order by name or created_at.
  query = query.order('name', { ascending: true });

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching public regions:", error.message);
    return [];
  }
  
  return data as Region[];
}
