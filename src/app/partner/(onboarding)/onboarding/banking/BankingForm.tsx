"use client";

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { saveBankingAction } from './actions';
import { savePartnerDocumentAction } from '../due-diligence/actions';
import { DocumentUploadCard } from '@/components/shared/documents/DocumentUploadCard';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { AutoSaveIndicator } from '@/components/shared/AutoSaveIndicator';
import toast from 'react-hot-toast';
import type { PartnerDocument, DocumentType } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BankingForm({ companyId, initialData, existingBankProof }: { companyId: string, initialData: any, existingBankProof: PartnerDocument | null }) {
  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [bankProofUploaded, setBankProofUploaded] = useState(!!existingBankProof);
  const router = useRouter();

  useEffect(() => {
    if (saveState === 'saved') {
      const timer = setTimeout(() => setSaveState('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  const handleUpload = async (type: DocumentType, url: string) => {
    const result = await savePartnerDocumentAction(companyId, 'BANK_PROOF', url);
    if (!result.success) {
      throw new Error(result.error);
    }
    setBankProofUploaded(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!bankProofUploaded) {
      toast.error("Please upload a cancelled cheque or bank statement.");
      return;
    }

    // Basic IFSC validation
    const ifsc = formData.get("bank_ifsc_code") as string;
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      toast.error("Invalid IFSC Code format.");
      return;
    }
    
    startTransition(async () => {
      setSaveState('saving');
      const result = await saveBankingAction(companyId, formData);
      if (result.success) {
        setSaveState('saved');
        setLastSaved(new Date());
        setIsComplete(true);
        setTimeout(() => {
          router.push("/partner/onboarding/first-trek");
        }, 1200);
      } else {
        setSaveState('error');
        toast.error(result.error || "Failed to save bank information");
      }
    });
  };

  const isSavingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const performSave = async (formData: FormData) => {
    isSavingRef.current = true;
    setSaveState('saving');
    const result = await saveBankingAction(companyId, formData);
    if (result.success) {
      setSaveState('saved');
      setLastSaved(new Date());
    } else {
      setSaveState('error');
    }
    isSavingRef.current = false;
  };

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const ifsc = formData.get("bank_ifsc_code") as string;
    if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return; // Don't autosave invalid ifsc

    startTransition(() => {
      if (!isSavingRef.current) {
        performSave(formData);
      } else {
        setTimeout(() => {
          if (formRef.current) {
            performSave(new FormData(formRef.current));
          }
        }, 1000);
      }
    });
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Bank Details Secured</h2>
        <p className="text-zinc-500 font-medium mt-2">Moving to First Trek setup...</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onBlur={handleBlur} className="space-y-10 pb-20">
      
      <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 bg-zinc-100 px-4 py-2 rounded-lg w-fit">
        <Lock className="w-4 h-4" />
        <span>End-to-End Encrypted</span>
      </div>

      <fieldset className="space-y-6">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Account Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="bank_account_holder_name" className="text-sm font-bold text-zinc-700">Account Holder Name *</label>
            <input 
              type="text" id="bank_account_holder_name" name="bank_account_holder_name" required 
              defaultValue={initialData?.bank_account_holder_name || ""}
              placeholder="Exactly as it appears on bank statement" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="bank_account_number" className="text-sm font-bold text-zinc-700">Account Number *</label>
            <input 
              type="text" id="bank_account_number" name="bank_account_number" required 
              defaultValue={initialData?.bank_account_number || ""}
              placeholder="e.g. 123456789012" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium font-mono tracking-wider" 
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bank_ifsc_code" className="text-sm font-bold text-zinc-700">IFSC Code *</label>
            <input 
              type="text" id="bank_ifsc_code" name="bank_ifsc_code" required 
              defaultValue={initialData?.bank_ifsc_code || ""}
              placeholder="HDFC0001234" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium uppercase font-mono tracking-wider" 
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bank_name" className="text-sm font-bold text-zinc-700">Bank Name *</label>
            <input 
              type="text" id="bank_name" name="bank_name" required 
              defaultValue={initialData?.bank_name || ""}
              placeholder="e.g. HDFC Bank" 
              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium" 
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Verification</h2>
        </div>
        
        <DocumentUploadCard
          companyId={companyId}
          documentType="BANK_PROOF"
          title="Cancelled Cheque or Statement *"
          description="Upload a cancelled cheque or recent bank statement showing the Account Number, IFSC code, and Holder Name."
          existingDocument={existingBankProof}
          onUploadComplete={handleUpload}
        />
      </fieldset>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-zinc-200 py-4 px-4 sm:px-6 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <AutoSaveIndicator state={saveState} lastSavedAt={lastSaved} />
          
          <button 
            type="submit" 
            disabled={isPending || isComplete || !bankProofUploaded}
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
