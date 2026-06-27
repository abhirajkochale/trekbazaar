import { createAdminClient } from '@/lib/supabase/admin';
import type { Company } from '../types';

export async function getCompanies(
  searchQuery?: string,
  statusFilter?: string,
  verificationFilter?: string,
  sortBy?: string
): Promise<Company[]> {
  const supabase = createAdminClient();
  
  let query = supabase.from("companies").select("*");
  
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
  }
  
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  if (verificationFilter && verificationFilter !== 'all') {
    query = query.eq('verification_status', verificationFilter);
  }
  
  switch (sortBy) {
    case 'name_asc':
      query = query.order('name', { ascending: true });
      break;
    case 'created_desc':
      query = query.order('created_at', { ascending: false });
      break;
    case 'updated_desc':
    default:
      query = query.order('updated_at', { ascending: false });
      break;
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
  
  return data as Company[];
}

export async function getCompany(id: string): Promise<Company> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as Company;
}

export async function getCompanyStats() {
  const supabase = createAdminClient();
  
  const [
    { count: totalCompanies },
    { count: verifiedCompanies },
    { count: pendingCompanies },
    { count: featuredCompanies },
    { count: totalTreks }
  ] = await Promise.all([
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    supabase.from("companies").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("treks").select("*", { count: "exact", head: true })
  ]);
  
  return {
    totalCompanies: totalCompanies || 0,
    verifiedCompanies: verifiedCompanies || 0,
    pendingCompanies: pendingCompanies || 0,
    featuredCompanies: featuredCompanies || 0,
    totalTreks: totalTreks || 0
  };
}

export async function saveCompany(payload: Partial<Company>): Promise<Company> {
  const supabase = createAdminClient();
  const id = payload.id;
  
  const updatePayload = { ...payload };
  delete updatePayload.id;
  delete updatePayload.created_at;
  delete updatePayload.updated_at;
  
  if (!id) {
    const { data, error } = await supabase
      .from("companies")
      .insert([updatePayload])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Company;
  }

  const { data, error } = await supabase
    .from("companies")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  return data as Company;
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleCompanyFeatured(id: string, currentFeatured: boolean): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("companies")
    .update({ featured: !currentFeatured })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
