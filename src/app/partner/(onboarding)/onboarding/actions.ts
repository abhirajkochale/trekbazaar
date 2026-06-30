"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function submitCompanyApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const contact_person = formData.get("contact_person") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  const adminClient = createAdminClient();

  // Insert the company as pending using adminClient to bypass RLS
  const { data, error } = await adminClient
    .from("companies")
    .insert({
      owner_id: user.id,
      name,
      slug,
      contact_person,
      phone,
      email,
      years_of_experience: 0,
      featured: false,
      onboarding_status: "REGISTERED",
      status: "suspended", // Needs admin approval to become active
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to submit company application:", error.message);
    throw new Error(`Database Error: ${error.message}`);
  }

  redirect("/partner/onboarding/status");
}
