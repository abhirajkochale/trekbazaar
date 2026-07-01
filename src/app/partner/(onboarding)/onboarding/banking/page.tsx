import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { BankingForm } from './BankingForm';
import { createClient } from '@/lib/supabase/server';

export default async function BankingPage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status !== "ok") {
    redirect("/partner/onboarding/terms");
  }

  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('partner_documents')
    .select('*')
    .eq('company_id', ctx.company.id)
    .eq('document_type', 'BANK_PROOF')
    .single();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Bank Details</h1>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">
          Your payouts will be transferred here. Bank information is encrypted at rest and only accessible by authorized TrekBazaar staff.
        </p>
      </div>

      <BankingForm 
        companyId={ctx.company.id} 
        initialData={ctx.company} 
        existingBankProof={documents || null} 
      />
    </div>
  );
}
