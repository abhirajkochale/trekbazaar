"use server";

import { revalidatePath } from "next/cache";
import { saveCompanyTrek } from "@/lib/company/treks";
import type { Trek } from "@/lib/types";

export async function saveCompanyTrekAction(payload: Partial<Trek>) {
  try {
    const trek = await saveCompanyTrek(payload);
    revalidatePath("/partner/dashboard/treks");
    revalidatePath(`/partner/dashboard/treks/${trek.id}/edit`);
    return { success: true, trekId: trek.id };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save trek";
    return { success: false, error: msg };
  }
}

export async function createInlineMasterTrekAction(name: string) {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { slugify } = await import("@/lib/format");
    
    const adminClient = createAdminClient();
    const slug = slugify(name);

    // First check if it exists by slug to avoid duplicates
    const { data: existing } = await adminClient
      .from("master_treks")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return { success: true, masterTrekId: existing.id, masterTrekName: name };
    }

    const { data, error } = await adminClient
      .from("master_treks")
      .insert({
        name,
        slug,
        status: "active",
        country: "India",
        gallery: [],
        highlights: []
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, masterTrekId: data.id, masterTrekName: data.name };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create destination";
    return { success: false, error: msg };
  }
}
