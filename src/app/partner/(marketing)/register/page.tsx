import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Create Partner Account | TrekBazaar',
  description: 'Join India\'s most trusted marketplace for trekking operators.',
};

export default async function PartnerRegisterPage() {
  const ctx = await getCompanyContext();

  // Prevent logged-in users from seeing registration
  if (ctx.status !== "unauthenticated") {
    if (ctx.status === "ok" && ctx.company.onboarding_status === "APPROVED") {
      redirect("/partner/dashboard");
    } else {
      redirect("/partner/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#0F3D2E] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Link href="/partner" className="text-[#111827] font-bold text-xl tracking-tight">
            TrekBazaar.
          </Link>
        </div>
        <h2 className="text-center text-3xl font-bold text-[#111827] tracking-tight mb-2">
          Create your account
        </h2>
        <p className="text-center text-[15px] text-[#6B7280]">
          Join the trusted marketplace for operators.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 sm:px-0">
          <form className="space-y-5" action="/api/partner/auth/register" method="POST">
            
            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Full Name
              </label>
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-200 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-[#0F3D2E] sm:text-[15px] transition-shadow text-[#111827]"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Email Address
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-200 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-[#0F3D2E] sm:text-[15px] transition-shadow text-[#111827]"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Password
              </label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-200 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-[#0F3D2E] sm:text-[15px] transition-shadow text-[#111827]"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[15px] font-medium text-white bg-[#0F3D2E] hover:bg-[#0a291f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D2E] transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/partner/login" className="font-medium text-[#111827] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100">
             <p className="text-[12px] text-[#6B7280] text-center leading-relaxed">
               By creating an account, you agree to our <Link href="#" className="underline hover:text-[#111827]">Terms of Service</Link> and <Link href="#" className="underline hover:text-[#111827]">Privacy Policy</Link>. All applications are verified.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
