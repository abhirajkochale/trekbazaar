import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { OnboardingStatus } from '@/lib/types';

const STEPS = [
  { id: 'REGISTERED', label: 'Create Account', estMinutes: 0 },
  { id: 'PROFILE_COMPLETED', label: 'Company Info', estMinutes: 2 },
  { id: 'DUE_DILIGENCE', label: 'Due Diligence', estMinutes: 4 },
  { id: 'TERMS_ACCEPTED', label: 'Commercial Terms', estMinutes: 5 },
  { id: 'KYC_COMPLETED', label: 'Bank Details', estMinutes: 3 },
  { id: 'READY_FOR_REVIEW', label: 'First Trek', estMinutes: 5 },
  { id: 'READY_FOR_REVIEW', label: 'First Departure', estMinutes: 2 },
  { id: 'READY_FOR_REVIEW', label: 'Review', estMinutes: 1 },
];

export default async function WizardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCompanyContext();
  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  // Determine current step index based on status
  let currentStepIndex = 1; // Default to Company Info
  const status = ctx.status === "ok" ? ctx.company.onboarding_status : null;

  if (status) {
    if (status === "PROFILE_COMPLETED") currentStepIndex = 2;
    if (status === "DUE_DILIGENCE") currentStepIndex = 3;
    if (status === "TERMS_ACCEPTED") currentStepIndex = 4;
    if (status === "KYC_COMPLETED") currentStepIndex = 5;
  }

  const currentStep = STEPS[currentStepIndex];
  const progressPercentage = Math.round(((currentStepIndex) / (STEPS.length - 1)) * 100);
  
  // Calculate remaining time
  const remainingMinutes = STEPS.slice(currentStepIndex).reduce((acc, step) => acc + step.estMinutes, 0);

  return (
    <div className="w-full min-h-screen bg-zinc-50 flex flex-col">
      {/* Sticky Top Progress Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Step {currentStepIndex} of {STEPS.length - 1}
              </span>
              <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none">
                {currentStep.label}
              </h1>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-zinc-900 mb-1">{progressPercentage}% Complete</div>
              <div className="text-xs font-medium text-zinc-500">~{remainingMinutes} mins remaining</div>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-zinc-100 rounded-full mb-[-1px] overflow-hidden">
            <div 
              className="h-full bg-zinc-900 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {children}
      </div>
    </div>
  );
}
