"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveBankingAction(companyId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const adminClient = createAdminClient();

  const { data: company } = await adminClient
    .from("companies")
    .select("id, onboarding_status")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .single();

  if (!company) return { success: false, error: "Unauthorized" };

  const bank_account_holder_name = formData.get("bank_account_holder_name") as string;
  const bank_name = formData.get("bank_name") as string;
  const bank_branch_name = formData.get("bank_branch_name") as string;
  const bank_account_number = formData.get("bank_account_number") as string;
  const bank_ifsc_code = formData.get("bank_ifsc_code") as string;
  const bank_account_type = formData.get("bank_account_type") as string;

  const payload = {
    bank_account_holder_name,
    bank_name,
    bank_branch_name,
    bank_account_number,
    bank_ifsc_code,
    bank_account_type
  };

  const { error } = await adminClient
    .from("companies")
    .update(payload)
    .eq("id", companyId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/partner/onboarding");
  return { success: true };
}

export async function advanceToNextStepAction(companyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const adminClient = createAdminClient();

  const { data: company } = await adminClient
    .from("companies")
    .select("id, onboarding_status")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .single();

  if (!company) return { success: false, error: "Unauthorized" };

  if (company.onboarding_status === "TERMS_ACCEPTED") {
    const { error } = await adminClient
      .from("companies")
      .update({ onboarding_status: "KYC_COMPLETED" })
      .eq("id", companyId);
      
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/partner/onboarding");
  return { success: true };
}
