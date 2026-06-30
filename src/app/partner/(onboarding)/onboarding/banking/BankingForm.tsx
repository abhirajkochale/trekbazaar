"use client";

import React, { useState, useTransition } from 'react';
import { saveBankingAction, advanceToNextStepAction } from './actions';
import { savePartnerDocumentAction } from '../due-diligence/actions';
import { DocumentUploadCard } from '@/components/shared/documents/DocumentUploadCard';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Building, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Company, PartnerDocument, DocumentType } from '@/lib/types';

export function BankingForm({ company, bankProofDocument }: { company: Company, bankProofDocument: PartnerDocument | null }) {
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  
  // Local state for validation
  const [ifsc, setIfsc] = useState(company.bank_ifsc_code || "");
  const [accountNumber, setAccountNumber] = useState(company.bank_account_number || "");
  const [confirmAccount, setConfirmAccount] = useState(company.bank_account_number || "");
  const [accountHolder, setAccountHolder] = useState(company.bank_account_holder_name || "");
  const [accountType, setAccountType] = useState(company.bank_account_type || "Current");
  const [bankName, setBankName] = useState(company.bank_name || "");
  const [bankBranch, setBankBranch] = useState(company.bank_branch_name || "");

  const handleUpload = async (type: DocumentType, url: string) => {
    const result = await savePartnerDocumentAction(company.id, type, url);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleAutoSave = () => {
    const formData = new FormData();
    formData.append("bank_account_holder_name", accountHolder);
    formData.append("bank_name", bankName);
    formData.append("bank_branch_name", bankBranch);
    formData.append("bank_account_number", accountNumber);
    formData.append("bank_ifsc_code", ifsc);
    formData.append("bank_account_type", accountType);

    startTransition(async () => {
      await saveBankingAction(company.id, formData);
    });
  };

  const validateAndPreview = (e: React.FormEvent) => {
    e.preventDefault();

    // IFSC validation (Standard Indian format: 4 letters, 1 zero, 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifsc.toUpperCase())) {
      toast.error("Invalid IFSC code format");
      return;
    }

    if (accountNumber !== confirmAccount) {
      toast.error("Account numbers do not match");
      return;
    }

    if (!bankProofDocument) {
      toast.error("Please upload a cancelled cheque or passbook");
      return;
    }

    // Force autosave before preview
    handleAutoSave();
    setShowPreview(true);
  };

  const handleFinalSubmit = () => {
    startTransition(async () => {
      const result = await advanceToNextStepAction(company.id);
      if (result.success) {
        toast.success("Banking details saved");
        router.push("/partner/onboarding/first-trek");
      } else {
        toast.error(result.error || "Failed to proceed");
      }
    });
  };

  const maskAccount = (num: string) => {
    if (num.length <= 4) return num;
    return "•".repeat(num.length - 4) + num.slice(-4);
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Review Bank Details</h2>
            <button 
              onClick={() => setShowPreview(false)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="w-12 h-12 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <div className="font-bold text-zinc-900">{bankName}</div>
                <div className="text-sm font-medium text-zinc-500">{bankBranch} • IFSC: {ifsc.toUpperCase()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Account Holder</div>
                <div className="font-medium text-zinc-900">{accountHolder}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Account Type</div>
                <div className="font-medium text-zinc-900">{accountType}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Account Number</div>
                <div className="font-mono text-lg font-bold text-zinc-900">{maskAccount(accountNumber)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleFinalSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Continue'}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-8">
          <form onSubmit={validateAndPreview} onBlur={handleAutoSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700">Account Holder Name *</label>
                <input 
                  type="text" 
                  required 
                  value={accountHolder}
                  onChange={e => setAccountHolder(e.target.value)}
                  placeholder="e.g. Sahyadri Adventures Pvt Ltd" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">Bank Name *</label>
                <input 
                  type="text" 
                  required 
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">Branch Name *</label>
                <input 
                  type="text" 
                  required 
                  value={bankBranch}
                  onChange={e => setBankBranch(e.target.value)}
                  placeholder="e.g. MG Road Branch" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">Account Number *</label>
                <input 
                  type="password" 
                  required 
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter account number" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium font-mono" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">Confirm Account Number *</label>
                <input 
                  type="text" 
                  required 
                  value={confirmAccount}
                  onChange={e => setConfirmAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter account number" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium font-mono" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">IFSC Code *</label>
                <input 
                  type="text" 
                  required 
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234" 
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium font-mono uppercase" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700">Account Type *</label>
                <select 
                  required 
                  value={accountType}
                  onChange={e => setAccountType(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary font-medium" 
                >
                  <option value="Current">Current</option>
                  <option value="Savings">Savings</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <DocumentUploadCard
                companyId={company.id}
                documentType="BANK_PROOF"
                title="Proof of Bank Account *"
                description="Upload a cancelled cheque or the first page of your passbook showing account details."
                existingDocument={bankProofDocument}
                onUploadComplete={handleUpload}
              />
            </div>

            <div className="pt-6 border-t border-zinc-200 flex justify-end">
              <button 
                type="submit" 
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Review Details'}
                {!isPending && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
