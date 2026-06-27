import { createAdminClient } from '@/lib/supabase/admin';
import type { MasterTrek } from '../types';

export async function getMasterTreks() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_treks')
    .select(`
      *,
      category:master_trek_categories(name),
      region:regions(name)
    `)
    .order('name');
    
  if (error) {
    console.error("Error fetching master treks:", error);
    return [];
  }
  return data;
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

export async function createMasterTrek(payload: Partial<MasterTrek>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_treks')
    .insert(payload)
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data as MasterTrek;
}

export async function updateMasterTrek(id: string, payload: Partial<MasterTrek>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('master_treks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data as MasterTrek;
}
