import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Trek } from "@/lib/types";

export async function getCompanyTreks(): Promise<Trek[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("treks")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  return (data || []) as Trek[];
}

export async function getCompanyTrek(id: string): Promise<Trek | null> {
  const companyId = await getCompanyId();
  if (!companyId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("treks")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle();

  return (data as Trek) || null;
}

export async function saveCompanyTrek(payload: Partial<Trek>): Promise<Trek> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error("Unauthorized");

  const supabase = await createClient();
  
  const dataToSave = {
    ...payload,
    company_id: companyId, // Force company_id to be the logged-in company
  };

  if (payload.id) {
    // Update existing
    const { data, error } = await supabase
      .from("treks")
      .update(dataToSave)
      .eq("id", payload.id)
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Trek;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("treks")
      .insert(dataToSave)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Trek;
  }
}
