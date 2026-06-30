"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OnboardingStatus } from "@/lib/types";

export async function updateApplicationStatusAction(companyId: string, status: OnboardingStatus) {
  const supabase = await createClient();

  // If approved, we also make the account active.
  // If rejected/suspended, we make it suspended.
  const accountStatus = status === "APPROVED" ? "active" : "suspended";

  const { error } = await supabase
    .from("companies")
    .update({ 
      onboarding_status: status,
      status: accountStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", companyId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/partner-applications");
  revalidatePath(`/admin/partner-applications/${companyId}`);
  revalidatePath(`/admin/companies`);
  return { success: true };
}
