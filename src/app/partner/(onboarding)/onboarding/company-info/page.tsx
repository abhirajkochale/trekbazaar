import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { CompanyInfoForm } from './CompanyInfoForm';

export default async function CompanyInfoPage() {
  const ctx = await getCompanyContext();
  
  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  // Pass existing data if any
  const initialData = ctx.status === "ok" ? ctx.company : null;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Company Information</h1>
        <p className="text-zinc-500 font-medium">Tell us about your organization. This information will be displayed on your public profile.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-8">
          <CompanyInfoForm initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
