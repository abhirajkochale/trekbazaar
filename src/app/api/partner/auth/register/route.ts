import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: "partner", // Important for identifying partner users if needed
      }
    }
  });

  if (error) {
    // In a real app, you'd want to handle this gracefully and show an error on the page
    console.error("Partner registration error:", error.message);
    return NextResponse.redirect(new URL("/partner/register?error=RegistrationFailed", request.url));
  }

  // After successful signup, redirect to the onboarding wizard
  return NextResponse.redirect(new URL("/partner/onboarding", request.url));
}
