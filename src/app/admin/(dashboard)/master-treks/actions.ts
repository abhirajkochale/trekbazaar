"use server";

import { revalidatePath } from "next/cache";
import { saveMasterTrek, archiveMasterTrek, deleteMasterTrek } from "@/lib/admin/master-treks";
import type { MasterTrek } from "@/lib/types";

export type MasterTrekFormState = {
  error?: string | null;
  success?: boolean;
  masterTrekId?: string;
};

export async function saveMasterTrekAction(
  payload: Partial<MasterTrek>
): Promise<MasterTrekFormState> {
  try {
    const saved = await saveMasterTrek(payload);

    revalidatePath("/admin/master-treks");
    revalidatePath(`/admin/master-treks/${saved.id}/edit`);
    
    return { success: true, error: null, masterTrekId: saved.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save Master Trek.";
    return { error: message, success: false };
  }
}

export async function performArchiveMasterTrek(id: string) {
  try {
    await archiveMasterTrek(id);
    revalidatePath("/admin/master-treks");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to archive Master Trek.";
    return { error: message };
  }
}

export async function performDeleteMasterTrek(id: string) {
  try {
    await deleteMasterTrek(id);
    revalidatePath("/admin/master-treks");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete Master Trek.";
    return { error: message };
  }
}
