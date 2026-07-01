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
    
    const { error } = await adminClient.from("companies").insert({
      owner_id: ctx.user.id,
      name: "New Partner Company",
      slug: uniqueSlug,
      onboarding_status: "REGISTERED",
      status: "suspended",
      featured: false
    });
    
    if (error) {
      console.error("Failed to initialize company", error);
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-xl font-bold text-red-500">Initialization Failed</h1>
          <p className="text-zinc-600 mt-2">{error.message}</p>
        </div>
      );
    }
  }

  // We fetch context again because we might have just created the company
  const finalCtx = await getCompanyContext();
  const status = finalCtx.status === "ok" ? finalCtx.company.onboarding_status : null;

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
