"use client";

import React, { useTransition, useState, useEffect } from 'react';
import { saveCompanyInfoAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { AutoSaveIndicator } from '@/components/shared/AutoSaveIndicator';
import toast from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompanyInfoForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  // Reset to idle after showing 'saved'
  useEffect(() => {
    if (saveState === 'saved') {
      const timer = setTimeout(() => setSaveState('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setSaveState('saving');
      const result = await saveCompanyInfoAction(formData);
      if (result.success) {
        setSaveState('saved');
        setLastSaved(new Date());
        setIsComplete(true);
        // Smooth transition intercept
        setTimeout(() => {
          router.push("/partner/onboarding/due-diligence");
        }, 1200);
      } else {
        setSaveState('error');
        toast.error(result.error || "Failed to save company information");
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    // Only auto-save if they blurred an input field that changed
    // For MVP, we'll just save the whole form
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setSaveState('saving');
      const result = await saveCompanyInfoAction(formData);
      if (result.success) {
        setSaveState('saved');
        setLastSaved(new Date());
      } else {
        setSaveState('error');
      }
    });
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Company Information Saved</h2>
        <p className="text-zinc-500 font-medium mt-2">Moving to Due Diligence...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onBlur={handleBlur} className="space-y-10 pb-20">
      
      {/* Business Information Section */}
      <fieldset className="space-y-6">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Business Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="name" className="text-sm font-bold text-zinc-700">Company Name *</label>
            <input 
              type="text" id="name" name="name" required 
              defaultValue={initialData?.name || ""}
              placeholder="e.g. Sahyadri Adventures" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="website" className="text-sm font-bold text-zinc-700">Official company website</label>
            <input 
              type="url" id="website" name="website" 
              defaultValue={initialData?.website || ""}
              placeholder="https://" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
            <p className="text-xs text-zinc-500 font-medium">Optional, but highly recommended for trust.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="years_of_experience" className="text-sm font-bold text-zinc-700">Years Operating *</label>
            <input 
              type="number" id="years_of_experience" name="years_of_experience" required min="0"
              defaultValue={initialData?.years_of_experience || ""}
              placeholder="e.g. 5" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="gst_number" className="text-sm font-bold text-zinc-700">GST Number</label>
            <input 
              type="text" id="gst_number" name="gst_number" 
              defaultValue={initialData?.gst_number || ""}
              placeholder="22AAAAA0000A1Z5" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium uppercase" 
            />
            <p className="text-xs text-zinc-500 font-medium">Required only if your business is GST registered in India.</p>
          </div>
        </div>
      </fieldset>

      {/* Support Information Section */}
      <fieldset className="space-y-6">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Support Contacts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-bold text-zinc-700">Support Email *</label>
            <input 
              type="email" id="email" name="email" required 
              defaultValue={initialData?.email || ""}
              placeholder="support@company.com" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
            <p className="text-xs text-zinc-500 font-medium">Customers will contact you here.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-zinc-700">Support Phone *</label>
            <input 
              type="tel" id="phone" name="phone" required 
              defaultValue={initialData?.phone || ""}
              placeholder="+91" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>
        </div>
      </fieldset>

      {/* Headquarters Section */}
      <fieldset className="space-y-6">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Headquarters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="address" className="text-sm font-bold text-zinc-700">Registered Address *</label>
            <input 
              type="text" id="address" name="address" required 
              defaultValue={initialData?.address || ""}
              placeholder="123 Trekking Hub, Main Street" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="city" className="text-sm font-bold text-zinc-700">City *</label>
            <input 
              type="text" id="city" name="city" required 
              defaultValue={initialData?.city || ""}
              placeholder="e.g. Dehradun" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="state" className="text-sm font-bold text-zinc-700">State *</label>
            <input 
              type="text" id="state" name="state" required 
              defaultValue={initialData?.state || ""}
              placeholder="e.g. Uttarakhand" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>
        </div>
      </fieldset>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-zinc-200 py-4 px-4 sm:px-6 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <AutoSaveIndicator state={saveState} lastSavedAt={lastSaved} />
          
          <button 
            type="submit" 
            disabled={isPending || isComplete}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </form>
  );
}
