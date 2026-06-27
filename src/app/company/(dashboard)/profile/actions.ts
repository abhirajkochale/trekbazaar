"use server";

import { revalidatePath } from "next/cache";
import { updateCompanyProfile } from "@/lib/company/profile";
import type { Company } from "@/lib/types";

export async function saveCompanyProfileAction(payload: Partial<Company>) {
  try {
    await updateCompanyProfile(payload);
    revalidatePath("/company/profile");
    revalidatePath("/company"); // To update the layout header name if changed
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: msg };
  }
}
