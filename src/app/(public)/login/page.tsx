"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res && !res.success) {
        setError(res.error || "Login failed");
        setLoading(false);
      }
      // If success, server action redirects to /account
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-zinc-50 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-tb-large p-8 border border-zinc-100">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold text-tb-primary tracking-tight mb-6">
            TrekBazaar
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
          <p className="text-zinc-500 mt-2 text-sm">Sign in to manage your bookings and wishlist.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-zinc-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-tb-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              name="password"
              type="password" 
              required
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className="h-12 text-base font-bold mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium">
              <span className="bg-white px-4 text-zinc-500">or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleAuthButton mode="login" />
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-tb-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
