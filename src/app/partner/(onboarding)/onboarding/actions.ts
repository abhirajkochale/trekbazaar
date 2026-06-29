"use server";

import { createClient } from "@/lib/supabase/server";
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

  // Insert the company as pending
  const { data, error } = await supabase
    .from("companies")
    .insert({
      owner_id: user.id,
      name,
      slug,
      contact_person,
      phone,
      email,
      verification_status: "pending",
      status: "suspended", // Needs admin approval to become active
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to submit company application:", error.message);
    throw new Error("Failed to submit application");
  }

  redirect("/partner/onboarding/status");
}
