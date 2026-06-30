import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { TermsForm } from './TermsForm';

export default async function TermsPage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status !== "ok") {
    redirect("/partner/onboarding/company-info");
  }

  // The latest terms version string
  const currentTermsVersion = "v1.0.0-2026";

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Commercial Agreement</h1>
        <p className="text-zinc-500 font-medium">Please review our marketplace rules and commercial terms before proceeding.</p>
      </div>

      <TermsForm 
        companyId={ctx.company.id} 
        currentVersion={currentTermsVersion} 
        alreadyAccepted={ctx.company.terms_accepted_at !== null && ctx.company.terms_version === currentTermsVersion}
      />
    </div>
  );
}
