"use server";

import { revalidatePath } from "next/cache";
import { 
  createTrek, 
  updateTrek, 
  deleteTrek, 
  duplicateTrek, 
  togglePublished 
} from "@/lib/admin/treks";
import type { Trek } from "@/lib/types";

export type SaveTrekResponse = {
  success: boolean;
  error?: string | null;
  trekId?: string;
};

export async function saveTrekAction(trekData: Partial<Trek>): Promise<SaveTrekResponse> {
  try {
    if (trekData.id) {
      await updateTrek(trekData.id, trekData);
      revalidatePath("/admin/treks");
      revalidatePath(`/admin/treks/${trekData.id}/edit`);
      return { success: true, trekId: trekData.id };
    } else {
      const newTrek = await createTrek(trekData);
      revalidatePath("/admin/treks");
      return { success: true, trekId: newTrek.id };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save trek.";
    return { success: false, error: message };
  }
}

export async function removeTrekAction(id: string) {
  try {
    await deleteTrek(id);
    revalidatePath("/admin/treks");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete trek.";
    return { success: false, error: message };
  }
}

export async function duplicateTrekAction(id: string) {
  try {
    const newId = await duplicateTrek(id);
    revalidatePath("/admin/treks");
    return { success: true, newId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to duplicate trek.";
    return { success: false, error: message };
  }
}

export async function togglePublishAction(id: string, currentStatus: string) {
  try {
    await togglePublished(id, currentStatus);
    revalidatePath("/admin/treks");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle status.";
    return { success: false, error: message };
  }
}
