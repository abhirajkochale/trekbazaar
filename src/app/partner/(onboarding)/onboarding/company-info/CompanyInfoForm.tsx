"use client";

import React, { useTransition } from 'react';
import { saveCompanyInfoAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompanyInfoForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await saveCompanyInfoAction(formData);
      if (result.success) {
        toast.success("Progress saved!");
        router.push("/partner/onboarding/due-diligence");
      } else {
        toast.error(result.error || "Failed to save company information");
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    // Auto-save on blur (optional implementation)
    // Could debounce this for real auto-save
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveCompanyInfoAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} onBlur={handleBlur} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-bold text-zinc-700">Company Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            defaultValue={initialData?.name || ""}
            placeholder="e.g. Sahyadri Adventures" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="website" className="text-sm font-bold text-zinc-700">Website URL</label>
          <input 
            type="url" 
            id="website" 
            name="website" 
            defaultValue={initialData?.website || ""}
            placeholder="https://..." 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="years_of_experience" className="text-sm font-bold text-zinc-700">Years Operating *</label>
          <input 
            type="number" 
            id="years_of_experience" 
            name="years_of_experience" 
            required 
            min="0"
            defaultValue={initialData?.years_of_experience || ""}
            placeholder="e.g. 5" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="gst_number" className="text-sm font-bold text-zinc-700">GST Number (Optional)</label>
          <input 
            type="text" 
            id="gst_number" 
            name="gst_number" 
            defaultValue={initialData?.gst_number || ""}
            placeholder="22AAAAA0000A1Z5" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium uppercase" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-bold text-zinc-700">Support Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            defaultValue={initialData?.email || ""}
            placeholder="support@company.com" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-bold text-zinc-700">Support Phone *</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            required 
            defaultValue={initialData?.phone || ""}
            placeholder="+91 98765 43210" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label htmlFor="address" className="text-sm font-bold text-zinc-700">Head Office Address *</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            required 
            defaultValue={initialData?.address || ""}
            placeholder="123 Trekking Hub, Main Street" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="city" className="text-sm font-bold text-zinc-700">City *</label>
          <input 
            type="text" 
            id="city" 
            name="city" 
            required 
            defaultValue={initialData?.city || ""}
            placeholder="Pune" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="state" className="text-sm font-bold text-zinc-700">State *</label>
          <input 
            type="text" 
            id="state" 
            name="state" 
            required 
            defaultValue={initialData?.state || ""}
            placeholder="Maharashtra" 
            className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-200 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Continue'}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
