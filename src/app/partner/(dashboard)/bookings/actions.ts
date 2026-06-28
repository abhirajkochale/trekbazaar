"use server";

import { revalidatePath } from "next/cache";
import { updateCompanyBookingStatus } from "@/lib/company/bookings";

export async function updateBookingStatusAction(id: string, status: string) {
  try {
    await updateCompanyBookingStatus(id, status);
    revalidatePath("/partner/bookings");
    revalidatePath("/partner"); // update dashboard stats
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: msg };
  }
}
