import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Company } from "@/lib/types";

export async function getCompanyProfile(): Promise<Company | null> {
  const companyId = await getCompanyId();
  if (!companyId) return null;

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Company;
}

export async function updateCompanyProfile(payload: Partial<Company>): Promise<Company> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error("Unauthorized");

  const supabase = await createClient();
  
  // Disallow modifying sensitive fields
  const safePayload = { ...payload };
  delete safePayload.id;
  delete safePayload.owner_id;
  delete safePayload.verification_status;
  delete safePayload.status;
  delete safePayload.featured;

  const { data, error } = await supabase
    .from("companies")
    .update(safePayload)
    .eq("id", companyId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Company;
}
