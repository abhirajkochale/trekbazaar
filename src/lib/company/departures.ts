import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Departure } from "@/lib/types";

export async function getCompanyDepartures(filters?: { trekId?: string; status?: string }): Promise<Departure[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const supabase = await createClient();
  
  let query = supabase
    .from("departures")
    .select("*, treks!inner(title, company_id)")
    .eq("treks.company_id", companyId)
    .order("departure_date", { ascending: false });

  if (filters?.trekId) query = query.eq("trek_id", filters.trekId);
  if (filters?.status && filters.status !== "All") query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }

  return (data || []) as unknown as Departure[];
}

export async function getCompanyDeparture(id: string): Promise<Departure | null> {
  const companyId = await getCompanyId();
  if (!companyId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("departures")
    .select("*, treks!inner(company_id)")
    .eq("id", id)
    .eq("treks.company_id", companyId)
    .maybeSingle();

  return (data as unknown as Departure) || null;
}

export async function saveCompanyDeparture(payload: Partial<Departure>): Promise<Departure> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error("Unauthorized");

  const supabase = await createClient();
  
  // Verify trek belongs to company
  if (payload.trek_id) {
    const { data: trek } = await supabase.from("treks").select("id").eq("id", payload.trek_id).eq("company_id", companyId).maybeSingle();
    if (!trek) throw new Error("Invalid Trek ID");
  }

  if (payload.id) {
    const { data, error } = await supabase
      .from("departures")
      .update(payload)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Departure;
  } else {
    const { data, error } = await supabase
      .from("departures")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Departure;
  }
}
