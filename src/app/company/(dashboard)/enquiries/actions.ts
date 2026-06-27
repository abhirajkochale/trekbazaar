"use server";

import { revalidatePath } from "next/cache";
import { updateCompanyEnquiryStatus } from "@/lib/company/enquiries";

export async function updateEnquiryStatusAction(id: string, status: string) {
  try {
    await updateCompanyEnquiryStatus(id, status);
    revalidatePath("/company/enquiries");
    revalidatePath("/company"); // update dashboard stats
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: msg };
  }
}
