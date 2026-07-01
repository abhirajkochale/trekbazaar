import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { DueDiligenceForm } from './DueDiligenceForm';
import { createClient } from '@/lib/supabase/server';
import type { PartnerDocument } from '@/lib/types';

export default async function DueDiligencePage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status !== "ok") {
    redirect("/partner/onboarding/company-info");
  }

  const status = ctx.company.onboarding_status;
  if (status === "REGISTERED") {
    redirect("/partner/onboarding/company-info");
  }

  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('partner_documents')
    .select('*')
    .eq('company_id', ctx.company.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Due Diligence</h1>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">
          These documents help us verify your company before customers can book with you. Verification usually takes 24-48 hours after final submission.
        </p>
      </div>

      <DueDiligenceForm 
        companyId={ctx.company.id} 
        existingDocuments={(documents as PartnerDocument[]) || []} 
      />
    </div>
  );
}
