import { createAdminClient } from '@/lib/supabase/admin';
import type { MasterTrekCategory } from '../types';

export async function getMasterTrekCategories() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_trek_categories')
    .select('*')
    .order('name');
    
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as MasterTrekCategory[];
}

export async function getMasterTrekCategoryById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_trek_categories')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return data as MasterTrekCategory;
}

export async function createMasterTrekCategory(payload: Partial<MasterTrekCategory>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_trek_categories')
    .insert(payload)
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data as MasterTrekCategory;
}

export async function updateMasterTrekCategory(id: string, payload: Partial<MasterTrekCategory>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_trek_categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data as MasterTrekCategory;
}
