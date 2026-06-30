"use client";

import React, { useState } from 'react';
import { setupPasswordAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';

export default function SetupPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await setupPasswordAction(formData);
      if (res && !res.success) {
        setError(res.error || "Failed to set password");
        setLoading(false);
      }
      // If success, server action redirects to /account
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-zinc-50 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-tb-large p-8 border border-zinc-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Secure Your Account</h1>
          <p className="text-zinc-500 text-sm">
            Please set a password for your account so you can also log in directly using your email in the future.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">New Password</label>
            <input 
              name="password"
              type="password" 
              required
              minLength={8}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              required
              minLength={8}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-tb-primary"
              placeholder="Confirm your password"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className="h-12 text-base font-bold mt-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Password & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
