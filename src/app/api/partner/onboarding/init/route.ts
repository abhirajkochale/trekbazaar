import { NextResponse } from "next/server";
import { initializePartnerProfile } from "@/app/actions/company-onboarding";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const { success, error } = await initializePartnerProfile();

  if (!success) {
    console.error("Partner init failed:", error);
    return NextResponse.redirect(`${origin}/partner/login?error=InitFailed`);
  }

  return NextResponse.redirect(`${origin}/partner/onboarding/company-info`);
}
