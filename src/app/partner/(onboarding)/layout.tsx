import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutCompany } from '@/app/actions/company-auth';

export default async function PartnerOnboardingLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCompanyContext();

  // Protect onboarding flow - must be logged in
  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  // If already approved, redirect to dashboard or post-approval flow
  if (ctx.status === "ok" && ctx.company.approval_status === "approved") {
    redirect("/partner/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="font-bold text-zinc-900 hidden sm:inline">Partner Onboarding</span>
        </div>
        
        <form action={logoutCompany}>
          <button 
            type="submit"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        {children}
      </main>
    </div>
  );
}
