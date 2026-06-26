"use server";

import { revalidatePath } from "next/cache";
import { createRegion, updateRegion, deleteRegion } from "@/lib/admin/regions";

export type RegionFormState = {
  error?: string | null;
  success?: boolean;
};

export async function saveRegion(
  prevState: RegionFormState | null,
  formData: FormData
): Promise<RegionFormState> {
  try {
    const id = formData.get("id")?.toString();

    if (id) {
      await updateRegion(id, formData);
    } else {
      await createRegion(formData);
    }

    revalidatePath("/admin/regions");
    revalidatePath("/regions");
    
    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save region.";
    return { error: message };
  }
}

export async function removeRegion(id: string) {
  try {
    await deleteRegion(id);
    revalidatePath("/admin/regions");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete region.";
    return { error: message };
  }
}
