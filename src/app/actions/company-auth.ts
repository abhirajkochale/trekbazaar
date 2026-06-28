"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginCompany(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to company portal dashboard
  redirect("/partner/dashboard");
}

export async function logoutCompany() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/partner/login");
}
