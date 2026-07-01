import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            T
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-zinc-900 tracking-tight">
          Create Partner Account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Already have an account?{' '}
          <Link href="/partner/login" className="font-bold text-tb-primary hover:text-zinc-900 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-zinc-200/60">
          <form className="space-y-6" action="/api/partner/auth/register" method="POST">
            
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-zinc-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary sm:text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary sm:text-sm font-medium"
                  placeholder="john@trekcompany.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-zinc-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-300 rounded-xl shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-zinc-900 bg-tb-primary hover:bg-tb-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tb-primary transition-all active:scale-95"
              >
                Create Account
              </button>
            </div>
            
            <p className="text-xs text-zinc-500 text-center leading-relaxed mt-4">
              By registering, you agree to TrekBazaar's Partner Terms of Service and Privacy Policy. All applications are subject to a manual verification process.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
