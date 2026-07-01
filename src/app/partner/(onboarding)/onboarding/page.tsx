import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';

export default async function PartnerOnboardingRedirect() {
  const ctx = await getCompanyContext();

  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  // If no company, go to company-info to create one
  if (ctx.status === "no-company") {
    redirect("/partner/onboarding/company-info");
  }

  const status = ctx.status === "ok" ? ctx.company.onboarding_status : null;

  // Progressive Disclosure: Redirect to the first incomplete step
  switch (status) {
    case "REGISTERED":
      redirect("/partner/onboarding/company-info");
    case "PROFILE_COMPLETED":
      redirect("/partner/onboarding/due-diligence");
    case "DUE_DILIGENCE":
      redirect("/partner/onboarding/terms");
    case "TERMS_ACCEPTED":
      redirect("/partner/onboarding/banking");
    case "KYC_COMPLETED":
    case "READY_FOR_REVIEW":
    case "CHANGES_REQUESTED":
    case "REJECTED":
    case "SUSPENDED":
      redirect("/partner/onboarding/status");
    case "APPROVED":
      redirect("/partner/dashboard");
    default:
      redirect("/partner/onboarding/company-info");
  }
}
