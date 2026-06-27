import { createClient } from "@/lib/supabase/server";
import { getCompanyId } from "./auth";
import type { Trek } from "@/lib/types";

export async function getCompanyTreks(): Promise<Trek[]> {
  const companyId = await getCompanyId();
  if (!companyId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("treks")
    .select("*, master_treks(name)")
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

  if (!payload.master_trek_id) {
    throw new Error("Master Trek is required.");
  }

  const { data: activeMasterTrek } = await supabase
    .from("master_treks")
    .select("id")
    .eq("id", payload.master_trek_id)
    .eq("status", "active")
    .maybeSingle();

  if (!activeMasterTrek) {
    throw new Error("Selected Master Trek must be active and exist.");
  }

  // Denormalize the DEPRECATED operator_* fields from the company profile, so
  // the public UI (which still reads operator_name) shows the real operator,
  // and so the company can never spoof these via the client payload. The
  // source of truth for the operator is treks.company_id.
  const { data: company } = await supabase
    .from("companies")
    .select("name, email, phone")
    .eq("id", companyId)
    .maybeSingle();

  const dataToSave: Partial<Trek> = {
    ...payload,
    company_id: companyId, // Never trust a client-supplied company_id.
    operator_name: company?.name ?? null,
    operator_contact: company?.email || company?.phone || null,
  };

  if (payload.id) {
    // Update existing — scoped to this company so one company can never edit
    // another company's trek (defence in depth alongside RLS).
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
    // Insert new — strip any client-injected id so this is always a create.
    delete dataToSave.id;
    const { data, error } = await supabase
      .from("treks")
      .insert(dataToSave)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Trek;
  }
}
