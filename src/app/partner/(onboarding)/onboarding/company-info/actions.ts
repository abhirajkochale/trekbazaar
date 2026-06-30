"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCompanyInfoAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const logo_url = formData.get("logo_url") as string || null;
  const website = formData.get("website") as string || null;
  const gst_number = formData.get("gst_number") as string || null;
  const years_of_experience = parseInt(formData.get("years_of_experience") as string || "0");
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;

  // We check if the company already exists
  const { data: existingCompany } = await supabase
    .from("companies")
    .select("id, onboarding_status")
    .eq("owner_id", user.id)
    .single();

  const payload = {
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    logo_url,
    website,
    gst_number,
    years_of_experience,
    email,
    phone,
    address,
    city,
    state,
    contact_person: name, // Simplified for now
    updated_at: new Date().toISOString()
  };

  let error = null;

  if (existingCompany) {
    const newStatus = existingCompany.onboarding_status === "REGISTERED" ? "PROFILE_COMPLETED" : existingCompany.onboarding_status;
    const { error: updateError } = await supabase
      .from("companies")
      .update({ ...payload, onboarding_status: newStatus })
      .eq("id", existingCompany.id);
    error = updateError;
  } else {
    // We create via admin client to bypass RLS initially as done before, or use the standard client if RLS allows inserts.
    // Assuming RLS allows insert for authenticated users with owner_id = auth.uid()
    const { error: insertError } = await supabase
      .from("companies")
      .insert({
        ...payload,
        owner_id: user.id,
        onboarding_status: "PROFILE_COMPLETED",
        status: "suspended",
        featured: false
      });
    error = insertError;
  }

  if (error) {
    console.error("Save company error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/partner/onboarding");
  return { success: true };
}
