"use client";

import React, { useState } from 'react';
import type { Company } from '@/lib/types';
import { provisionCompanyUser } from '@/app/admin/(dashboard)/companies/auth-actions';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Props {
  company: Partial<Company>;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function CredentialsSection({ company }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If company is not saved yet, don't allow provisioning
  if (!company.id) {
    return (
      <div className="text-sm text-zinc-500 italic p-4 bg-zinc-50 rounded-lg border border-zinc-200">
        You must save the company first before provisioning login credentials.
      </div>
    );
  }

  // We check if owner_id exists in the database. But since we don't have owner_id in the Company type yet, 
  // we'll just show the form and let the admin overwrite/re-provision if needed, or handle it via a note.
  
  const handleProvision = async () => {
    if (!email || !password || password.length < 6) {
      toast.error("Please provide a valid email and a password (min 6 characters).");
      return;
    }

    if (!confirm(`Are you sure you want to provision login credentials for ${email}? This will create a new account for this partner.`)) {
      return;
    }

    setIsLoading(true);
    const res = await provisionCompanyUser(company.id as string, email, password);
    setIsLoading(false);

    if (res.success) {
      toast.success("Credentials provisioned successfully!");
      setEmail('');
      setPassword('');
    } else {
      toast.error(res.error || "Failed to provision credentials");
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-1">Partner Portal Access</h4>
        <p className="text-xs text-blue-800">
          Provision login credentials so this company can log in to the <strong>Partner Portal</strong> (<code>/company/login</code>) and manage their own inventory.
        </p>
      </div>

      <div>
        <label className={labelClasses}>Login Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          placeholder="partner@company.com"
        />
      </div>

      <div>
        <label className={labelClasses}>Temporary Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
          placeholder="e.g. TrekBazaar2026!"
        />
        <p className="text-[10px] text-zinc-500 mt-1">Must be at least 6 characters.</p>
      </div>

      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleProvision}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? "Provisioning..." : "Provision Credentials"}
        </Button>
      </div>
    </div>
  );
}
