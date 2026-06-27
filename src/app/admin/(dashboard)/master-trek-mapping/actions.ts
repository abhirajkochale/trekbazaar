"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function mapPackageAction(trekId: string, masterTrekId: string) {
  try {
    const supabase = createAdminClient();

    // Validate active master trek exists
    const { data: mt, error: mtError } = await supabase
      .from("master_treks")
      .select("id")
      .eq("id", masterTrekId)
      .eq("status", "active")
      .maybeSingle();

    if (mtError || !mt) {
      return { success: false, error: "Master Trek must exist and be active." };
    }

    // Attempt to update. Unique constraint on (company_id, master_trek_id) will throw if duplicate
    const { error: updateError } = await supabase
      .from("treks")
      .update({ master_trek_id: masterTrekId, updated_at: new Date().toISOString() })
      .eq("id", trekId);

    if (updateError) {
      if (updateError.code === "23505") { // Postgres unique violation code
        return { success: false, error: "This company already has a package mapped to this Master Trek." };
      }
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin/master-trek-mapping");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message || "Failed to map package." };
    }
    return { success: false, error: "Failed to map package." };
  }
}
