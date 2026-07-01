"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  const adminClient = createAdminClient();

  // We check if the company already exists. 
  // We use adminClient because the company is 'suspended' during onboarding and RLS blocks regular select.
  const { data: existingCompany } = await adminClient
    .from("companies")
    .select("id, onboarding_status")
    .eq("owner_id", user.id)
    .single();

  if (!existingCompany) {
    return { success: false, error: "Company not found. Please contact support." };
  }

  const payload = {
    name,
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

  const newStatus = existingCompany.onboarding_status === "REGISTERED" ? "PROFILE_COMPLETED" : existingCompany.onboarding_status;
  
  const { error } = await adminClient
    .from("companies")
    .update({ ...payload, onboarding_status: newStatus })
    .eq("id", existingCompany.id)
    .eq("owner_id", user.id); // Extra safety check

  if (error) {
    console.error("Save company error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/partner/onboarding");
  return { success: true };
}
