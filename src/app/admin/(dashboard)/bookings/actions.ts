"use server";

import { revalidatePath } from "next/cache";
import { updateBookingStatus } from "@/lib/admin/bookings";

export async function updateAdminBookingStatusAction(id: string, status: string) {
  try {
    await updateBookingStatus(id, status);
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: msg };
  }
}
