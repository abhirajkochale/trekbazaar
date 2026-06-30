"use client";

import React, { useTransition } from 'react';
import { DocumentUploadCard } from '@/components/shared/documents/DocumentUploadCard';
import { savePartnerDocumentAction, advanceToTermsAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PartnerDocument, DocumentType } from '@/lib/types';

interface DueDiligenceFormProps {
  companyId: string;
  documents: PartnerDocument[];
}

export function DueDiligenceForm({ companyId, documents }: DueDiligenceFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getDoc = (type: DocumentType) => documents.find(d => d.document_type === type) || null;

  const handleUpload = async (type: DocumentType, url: string) => {
    const result = await savePartnerDocumentAction(companyId, type, url);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleContinue = () => {
    // Basic validation: ensure mandatory docs are present
    const mandatory = ["PAN", "COMPANY_REGISTRATION", "OWNER_ID"];
    const missing = mandatory.filter(m => !getDoc(m as DocumentType));
    
    if (missing.length > 0) {
      toast.error(`Please upload mandatory documents: ${missing.join(', ')}`);
      return;
    }

    startTransition(async () => {
      const result = await advanceToTermsAction(companyId);
      if (result.success) {
        toast.success("Saved successfully");
        router.push("/partner/onboarding/terms");
      } else {
        toast.error(result.error || "Failed to save progress");
      }
    });
  };

  return (
    <div className="space-y-6">
      <DocumentUploadCard
        companyId={companyId}
        documentType="COMPANY_REGISTRATION"
        title="Business Registration *"
        description="Certificate of Incorporation, MSME Certificate, or Shop Act License."
        existingDocument={getDoc("COMPANY_REGISTRATION")}
        onUploadComplete={handleUpload}
      />

      <DocumentUploadCard
        companyId={companyId}
        documentType="PAN"
        title="Company PAN Card *"
        description="Permanent Account Number issued by the Income Tax Department."
        existingDocument={getDoc("PAN")}
        onUploadComplete={handleUpload}
      />

      <DocumentUploadCard
        companyId={companyId}
        documentType="GST"
        title="GST Certificate"
        description="Required if your annual turnover exceeds the threshold."
        existingDocument={getDoc("GST")}
        onUploadComplete={handleUpload}
      />

      <DocumentUploadCard
        companyId={companyId}
        documentType="OWNER_ID"
        title="Owner Identity Proof *"
        description="Aadhaar Card or Passport of the primary business owner/director."
        existingDocument={getDoc("OWNER_ID")}
        onUploadComplete={handleUpload}
      />

      <div className="pt-6 border-t border-zinc-200 flex justify-end">
        <button 
          onClick={handleContinue}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Continue'}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
