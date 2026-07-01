import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { TermsForm } from './TermsForm';

export default async function TermsPage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status !== "ok") {
    redirect("/partner/onboarding/due-diligence");
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Commercial Agreement</h1>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">
          Understand how TrekBazaar works before joining the marketplace. Please read these terms carefully.
        </p>
      </div>

      <TermsForm companyId={ctx.company.id} />
    </div>
  );
}
