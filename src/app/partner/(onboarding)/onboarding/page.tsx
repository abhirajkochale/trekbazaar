import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { submitCompanyApplication } from './actions';
import { Building2, Briefcase, FileCheck, ArrowRight } from 'lucide-react';

export default async function PartnerOnboardingWizard() {
  const ctx = await getCompanyContext();

  // If they already have a company, redirect to status or dashboard
  if (ctx.status === "ok") {
    if (ctx.company.verification_status === "approved") {
      redirect("/partner/dashboard");
    } else {
      redirect("/partner/onboarding/status");
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Complete Your Partner Profile</h1>
        <p className="text-zinc-500 font-medium">Tell us about your trekking company to begin the verification process.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/40 border border-zinc-200 overflow-hidden">
        <div className="p-8">
          <form action={submitCompanyApplication} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                <Building2 className="w-4 h-4 text-tb-primary" />
                <h2 className="text-lg font-bold text-zinc-900">Company Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-bold text-zinc-700">Company Name</label>
                  <input type="text" id="name" name="name" required placeholder="e.g. Sahyadri Adventures" className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="slug" className="text-sm font-bold text-zinc-700">URL Slug</label>
                  <div className="flex items-center">
                    <span className="text-sm text-zinc-500 bg-zinc-50 border border-zinc-300 border-r-0 px-3 py-2 rounded-l-xl">trekbazaar.com/company/</span>
                    <input type="text" id="slug" name="slug" required placeholder="sahyadri-adventures" className="flex-1 px-3 py-2 border border-zinc-300 rounded-r-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                <Briefcase className="w-4 h-4 text-tb-primary" />
                <h2 className="text-lg font-bold text-zinc-900">Primary Contact</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="contact_person" className="text-sm font-bold text-zinc-700">Contact Person Name</label>
                  <input type="text" id="contact_person" name="contact_person" required placeholder="Full Name" className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-sm font-bold text-zinc-700">Phone Number</label>
                  <input type="tel" id="phone" name="phone" required placeholder="+91 98765 43210" className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="email" className="text-sm font-bold text-zinc-700">Business Email</label>
                  <input type="email" id="email" name="email" required defaultValue={ctx.status === "no-company" ? ctx.user.email : ""} placeholder="hello@company.com" className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                  <FileCheck className="w-4 h-4 text-zinc-500" />
                  Your application will be reviewed manually.
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md active:scale-95">
                  Submit Application <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
