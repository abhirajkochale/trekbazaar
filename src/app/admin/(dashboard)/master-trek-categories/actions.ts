"use server";

import { revalidatePath } from "next/cache";
import { createMasterTrekCategory, updateMasterTrekCategory, deleteMasterTrekCategory } from "@/lib/admin/categories";

export type CategoryFormState = {
  error?: string | null;
  success?: boolean;
};

export async function saveCategory(
  prevState: CategoryFormState | null,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    const id = formData.get("id")?.toString();

    if (id) {
      await updateMasterTrekCategory(id, formData);
    } else {
      await createMasterTrekCategory(formData);
    }

    revalidatePath("/admin/master-trek-categories");
    
    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save category.";
    return { error: message };
  }
}

export async function removeCategory(id: string) {
  try {
    await deleteMasterTrekCategory(id);
    revalidatePath("/admin/master-trek-categories");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete category.";
    return { error: message };
  }
}
