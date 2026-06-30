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

  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('partner_documents')
    .select('*')
    .eq('company_id', ctx.company.id);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Due Diligence</h1>
        <p className="text-zinc-500 font-medium">Please upload the required compliance documents to verify your business identity.</p>
      </div>

      <DueDiligenceForm companyId={ctx.company.id} documents={(documents || []) as PartnerDocument[]} />
    </div>
  );
}
