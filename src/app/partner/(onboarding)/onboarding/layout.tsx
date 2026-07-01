import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { OnboardingStatus } from '@/lib/types';
import { createAdminClient } from '@/lib/supabase/admin';

import { WizardHeader } from '@/components/partner/onboarding/WizardHeader';

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCompanyContext();
  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  // Enforce Single Source of Truth for company existence
  if (ctx.status === "no-company") {
    const adminClient = createAdminClient();
    const uniqueSlug = `company-${ctx.user.id.substring(0, 12)}`;
    
    await adminClient.from("companies").insert({
      owner_id: ctx.user.id,
      slug: uniqueSlug,
      onboarding_status: "REGISTERED",
      status: "suspended",
      featured: false
    });
    
    // Force a hard refresh to grab the new company context
    redirect("/partner/onboarding");
  }

  const status = ctx.status === "ok" ? ctx.company.onboarding_status : null;

  return (
    <div className="w-full min-h-screen bg-zinc-50 flex flex-col">
      <WizardHeader status={status} />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {children}
      </div>
    </div>
  );
}
