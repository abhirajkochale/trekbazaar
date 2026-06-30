import { createClient } from '@/lib/supabase/server';
import type { MasterTrekCategory } from '@/lib/types';

export async function getPublicCategories(): Promise<MasterTrekCategory[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('master_trek_categories')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching public categories:', error);
    return [];
  }

  return data as MasterTrekCategory[];
}
