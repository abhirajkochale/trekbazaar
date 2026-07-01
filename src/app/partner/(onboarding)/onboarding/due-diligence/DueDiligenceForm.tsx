"use client";

import React, { useState, useTransition } from 'react';
import { advanceToTermsAction, savePartnerDocumentAction } from './actions';
import { DocumentUploadCard } from '@/components/shared/documents/DocumentUploadCard';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PartnerDocument, DocumentType } from '@/lib/types';

export function DueDiligenceForm({ companyId, existingDocuments }: { companyId: string, existingDocuments: PartnerDocument[] }) {
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  
  // Track successful uploads locally to allow optimistic continuing
  const [uploadedDocs, setUploadedDocs] = useState<Record<DocumentType, boolean>>({
    'COMPANY_REGISTRATION': !!existingDocuments.find(d => d.document_type === 'COMPANY_REGISTRATION'),
    'PAN': !!existingDocuments.find(d => d.document_type === 'PAN'),
    'OWNER_ID': !!existingDocuments.find(d => d.document_type === 'OWNER_ID'),
    'GST': !!existingDocuments.find(d => d.document_type === 'GST'),
    'BANK_PROOF': false,
    'OTHER': false
  });

  const allMandatoryUploaded = uploadedDocs['COMPANY_REGISTRATION'] && uploadedDocs['PAN'] && uploadedDocs['OWNER_ID'];

  const handleUpload = async (type: DocumentType, url: string) => {
    const result = await savePartnerDocumentAction(companyId, type, url);
    if (!result.success) {
      throw new Error(result.error);
    }
    setUploadedDocs(prev => ({ ...prev, [type]: true }));
  };

  const handleContinue = () => {
    if (!allMandatoryUploaded) {
      toast.error("Please upload all mandatory documents to continue");
      return;
    }

    startTransition(async () => {
      const result = await advanceToTermsAction(companyId);
      if (result.success) {
        setIsComplete(true);
        setTimeout(() => {
          router.push("/partner/onboarding/terms");
        }, 1200);
      } else {
        toast.error(result.error || "Failed to proceed");
      }
    });
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Documents Saved</h2>
        <p className="text-zinc-500 font-medium mt-2">Moving to Commercial Terms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="grid grid-cols-1 gap-6">
        <DocumentUploadCard
          companyId={companyId}
          documentType="COMPANY_REGISTRATION"
          title="Company Registration Certificate *"
          description="Proof of your business registration (e.g., Certificate of Incorporation, MSME, Partnership Deed)."
          existingDocument={existingDocuments.find(d => d.document_type === 'COMPANY_REGISTRATION')}
          onUploadComplete={handleUpload}
        />

        <DocumentUploadCard
          companyId={companyId}
          documentType="PAN"
          title="Company PAN Card *"
          description="A clear, readable copy of the business PAN card. Must match the registered business name."
          existingDocument={existingDocuments.find(d => d.document_type === 'PAN')}
          onUploadComplete={handleUpload}
        />

        <DocumentUploadCard
          companyId={companyId}
          documentType="OWNER_ID"
          title="Owner/Director Government ID *"
          description="Aadhar or Passport of the primary business owner. Used strictly for identity verification."
          existingDocument={existingDocuments.find(d => d.document_type === 'OWNER_ID')}
          onUploadComplete={handleUpload}
        />
        
        <DocumentUploadCard
          companyId={companyId}
          documentType="GST"
          title="GST Registration Certificate"
          description="Optional. Required only if your business is GST registered."
          existingDocument={existingDocuments.find(d => d.document_type === 'GST')}
          onUploadComplete={handleUpload}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-zinc-200 py-4 px-4 sm:px-6 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-700">
              {allMandatoryUploaded ? 'All set to go.' : '3 mandatory documents required.'}
            </span>
          </div>
          <button 
            onClick={handleContinue}
            disabled={!allMandatoryUploaded || isPending}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
