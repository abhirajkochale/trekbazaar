import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import { Clock, XCircle, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function PartnerStatusPage() {
  const ctx = await getCompanyContext();

  if (ctx.status === "unauthenticated") {
    redirect("/partner/login");
  }

  if (ctx.status === "no-company" || ctx.status === "multiple-companies") {
    redirect("/partner/onboarding");
  }

  const { company } = ctx;
  const status = company.verification_status;

  if (status === "approved") {
    redirect("/partner/dashboard");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-10 shadow-xl shadow-zinc-200/40 border border-zinc-200 text-center relative overflow-hidden">
        
        {status === "pending" && (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Application Under Review</h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
              Thank you for applying to join TrekBazaar, <span className="font-bold text-zinc-900">{company.name}</span>. Our team is currently reviewing your profile to ensure quality standards. This process usually takes 24-48 hours.
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 inline-block text-left w-full max-w-sm">
              <div className="text-sm font-bold text-zinc-900 mb-1">What happens next?</div>
              <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
                <li>We verify your company details</li>
                <li>You'll receive an email notification</li>
                <li>Your partner dashboard unlocks</li>
              </ul>
            </div>
          </>
        )}

        {status === "rejected" && (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Application Declined</h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
              We regret to inform you that your application for <span className="font-bold text-zinc-900">{company.name}</span> could not be approved at this time.
            </p>
            <p className="text-sm text-zinc-500">
              Please contact support@trekbazaar.com if you believe this was a mistake.
            </p>
          </>
        )}

        {status === "changes_requested" && (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Changes Requested</h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
              We need a bit more information before we can approve <span className="font-bold text-zinc-900">{company.name}</span>. Please check your email for specific details from our team.
            </p>
          </>
        )}

        {status === "suspended" && (
          <>
            <div className="absolute top-0 left-0 w-full h-2 bg-zinc-900" />
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
              <ShieldCheck className="w-8 h-8 text-zinc-500" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-4">Account Suspended</h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
              Your partner account for <span className="font-bold text-zinc-900">{company.name}</span> has been temporarily suspended. You cannot access the dashboard or accept new bookings.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
