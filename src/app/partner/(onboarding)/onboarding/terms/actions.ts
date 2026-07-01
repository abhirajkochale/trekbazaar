"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function acceptTermsAction(companyId: string, version: string) {
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

  // Only update status if it's DUE_DILIGENCE or earlier. 
  // If it's already past this, don't downgrade it.
  const shouldUpdateStatus = ["REGISTERED", "PROFILE_COMPLETED", "DUE_DILIGENCE"].includes(company.onboarding_status);
  const newStatus = shouldUpdateStatus ? "TERMS_ACCEPTED" : company.onboarding_status;

  const { error } = await adminClient
    .from("companies")
    .update({ 
      terms_accepted_at: new Date().toISOString(),
      terms_version: version,
      onboarding_status: newStatus
    })
    .eq("id", companyId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/partner/onboarding");
  return { success: true };
}
