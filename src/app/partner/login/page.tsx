"use client";

import React, { useState } from "react";
import { loginCompany } from "@/app/actions/company-auth";
import Link from "next/link";

export default function CompanyLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await loginCompany(formData);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
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
          Welcome back
        </h2>
        <p className="text-center text-[15px] text-[#6B7280]">
          Sign in to manage your treks and bookings.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white py-8 px-4 sm:px-0">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
                Email Address
              </label>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-200 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-[#0F3D2E] sm:text-[15px] transition-shadow text-[#111827]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[13px] font-medium text-[#111827]">
                  Password
                </label>
                <Link href="#" className="text-[13px] text-[#6B7280] hover:text-[#111827] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-zinc-200 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] focus:border-[#0F3D2E] sm:text-[15px] transition-shadow text-[#111827]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[15px] font-medium text-white bg-[#0F3D2E] hover:bg-[#0a291f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D2E] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#6B7280]">
              New to TrekBazaar?{' '}
              <Link href="/partner/register" className="font-medium text-[#111827] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
