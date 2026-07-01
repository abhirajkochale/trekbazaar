import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { CompanyInfoForm } from './CompanyInfoForm';

export default async function CompanyInfoPage() {
  const ctx = await getCompanyContext();
  const initialData = ctx.status === "ok" ? ctx.company : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Company Information</h1>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">
          Tell us about your organization so customers can trust your profile. Profiles with complete information convert 40% better on the marketplace.
        </p>
      </div>
      <CompanyInfoForm initialData={initialData} />
    </div>
  );
}
