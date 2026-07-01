"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export const STEPS = [
  { id: 'REGISTERED', path: 'company-info', label: 'Company Info', estMinutes: 2 },
  { id: 'PROFILE_COMPLETED', path: 'due-diligence', label: 'Due Diligence', estMinutes: 4 },
  { id: 'DUE_DILIGENCE', path: 'terms', label: 'Commercial Terms', estMinutes: 5 },
  { id: 'TERMS_ACCEPTED', path: 'banking', label: 'Bank Details', estMinutes: 3 },
  { id: 'KYC_COMPLETED', path: 'first-trek', label: 'First Trek', estMinutes: 5 },
  { id: 'READY_FOR_REVIEW', path: 'review', label: 'Review', estMinutes: 1 },
];

export function WizardHeader({ status }: { status: string | null }) {
  const pathname = usePathname() || "";

  // Find the step corresponding to the current URL
  const currentStepIndex = STEPS.findIndex(step => pathname.includes(step.path));
  const activeStep = currentStepIndex !== -1 ? STEPS[currentStepIndex] : STEPS[0];
  const displayStepNumber = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  // Calculate maximum unlocked step based on status
  let maxStepIndex = 0;
  if (status === "PROFILE_COMPLETED") maxStepIndex = 1;
  if (status === "DUE_DILIGENCE") maxStepIndex = 2;
  if (status === "TERMS_ACCEPTED") maxStepIndex = 3;
  if (status === "KYC_COMPLETED") maxStepIndex = 4;
  if (status === "READY_FOR_REVIEW" || status === "APPROVED") maxStepIndex = 5;

  const progressPercentage = Math.round((maxStepIndex / (STEPS.length - 1)) * 100);
  
  // Calculate remaining time from the currently active step
  const remainingMinutes = STEPS.slice(displayStepNumber - 1).reduce((acc, step) => acc + step.estMinutes, 0);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Step {displayStepNumber} of {STEPS.length}
            </span>
            <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none">
              {activeStep.label}
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
  );
}
