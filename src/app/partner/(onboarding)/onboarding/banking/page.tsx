import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { BankingForm } from './BankingForm';
import { createClient } from '@/lib/supabase/server';
import type { PartnerDocument } from '@/lib/types';

export default async function BankingPage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status !== "ok") {
    redirect("/partner/onboarding/company-info");
  }

  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('partner_documents')
    .select('*')
    .eq('company_id', ctx.company.id)
    .eq('document_type', 'BANK_PROOF')
    .single();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Bank Details</h1>
        <p className="text-zinc-500 font-medium">Where should we send your payouts? Please ensure the name matches your business registration.</p>
      </div>

      <BankingForm 
        company={ctx.company} 
        bankProofDocument={(documents as PartnerDocument) || null} 
      />
    </div>
  );
}
