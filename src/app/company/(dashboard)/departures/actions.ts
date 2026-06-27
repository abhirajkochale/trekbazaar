"use server";

import { revalidatePath } from "next/cache";
import { saveCompanyDeparture } from "@/lib/company/departures";
import type { Departure } from "@/lib/types";

export async function saveCompanyDepartureAction(payload: Partial<Departure>) {
  try {
    const departure = await saveCompanyDeparture(payload);
    revalidatePath("/company/departures");
    revalidatePath(`/company/departures/${departure.id}/edit`);
    return { success: true, departureId: departure.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save departure";
    return { success: false, error: msg };
  }
}
