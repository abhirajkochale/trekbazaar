import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Enquiry } from "@/lib/types";

export async function getCompanyEnquiries(): Promise<Enquiry[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const supabase = await createClient();
  
  // Note: Enquiries do not have company_id directly. We must join through treks.
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, treks!inner(title, company_id)")
    .eq("treks.company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []) as unknown as Enquiry[];
}

export async function updateCompanyEnquiryStatus(id: string, status: string): Promise<boolean> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error("Unauthorized");

  const supabase = await createClient();
  
  // Verify it belongs to the company's trek
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("id, treks!inner(company_id)")
    .eq("id", id)
    .eq("treks.company_id", companyId)
    .maybeSingle();

  if (!enquiry) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
