import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, FileCheck, ShieldCheck, CreditCard, Tent, CalendarDays, CheckCircle2 } from 'lucide-react';
import type { OnboardingStatus } from '@/lib/types';

const STEPS = [
  { id: 'REGISTERED', label: 'Create Account', href: '#', icon: CheckCircle2, completed: true },
  { id: 'PROFILE_COMPLETED', label: 'Company Info', href: '/partner/onboarding/company-info', icon: Building2 },
  { id: 'DUE_DILIGENCE', label: 'Due Diligence', href: '/partner/onboarding/due-diligence', icon: ShieldCheck },
  { id: 'TERMS_ACCEPTED', label: 'Commercial Terms', href: '/partner/onboarding/terms', icon: FileCheck },
  { id: 'KYC_COMPLETED', label: 'Bank Details', href: '/partner/onboarding/banking', icon: CreditCard },
  { id: 'READY_FOR_REVIEW', label: 'First Trek', href: '/partner/onboarding/first-trek', icon: Tent },
  { id: 'READY_FOR_REVIEW', label: 'First Departure', href: '/partner/onboarding/first-departure', icon: CalendarDays },
  { id: 'READY_FOR_REVIEW', label: 'Review', href: '/partner/onboarding/review', icon: CheckCircle2 },
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
    // For READY_FOR_REVIEW and others, we let the review page handle it.
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 bg-white border border-zinc-200 rounded-2xl p-6 sticky top-24">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-6">Onboarding Steps</h3>
        <nav className="space-y-1">
          {STEPS.map((step, index) => {
            const isCompleted = step.completed || index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLocked = index > currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                  ${isCurrent ? 'bg-zinc-900 text-white shadow-sm' : ''}
                  ${isCompleted && !isCurrent ? 'text-zinc-900 hover:bg-zinc-50' : ''}
                  ${isLocked ? 'text-zinc-400 cursor-not-allowed opacity-60' : ''}
                `}
              >
                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span>{step.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        {children}
      </div>
    </div>
  );
}
