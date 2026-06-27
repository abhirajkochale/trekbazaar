"use server";

import { revalidatePath } from "next/cache";
import { saveCompanyTrek } from "@/lib/company/treks";
import type { Trek } from "@/lib/types";

export async function saveCompanyTrekAction(payload: Partial<Trek>) {
  try {
    const trek = await saveCompanyTrek(payload);
    revalidatePath("/company/treks");
    revalidatePath(`/company/treks/${trek.id}/edit`);
    return { success: true, trekId: trek.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save trek";
    return { success: false, error: msg };
  }
}
