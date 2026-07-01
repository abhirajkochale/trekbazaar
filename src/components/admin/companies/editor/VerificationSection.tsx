"use client";

import React from 'react';
import type { Company } from '@/lib/types';

interface Props {
  company: Partial<Company>;
  updateField: <K extends keyof Company>(field: K, value: Company[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function VerificationSection({ company, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClasses}>Verification Status</label>
        <select
          value={company.onboarding_status || 'pending'}
          onChange={(e) => updateField('onboarding_status', e.target.value as Company['onboarding_status'])}
          className={inputClasses}
        >
          <option value="REGISTERED">Registered</option>
          <option value="PROFILE_COMPLETED">Profile Completed</option>
          <option value="DUE_DILIGENCE">Due Diligence</option>
          <option value="TERMS_ACCEPTED">Terms Accepted</option>
          <option value="KYC_COMPLETED">KYC Completed</option>
          <option value="READY_FOR_REVIEW">Ready For Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CHANGES_REQUESTED">Changes Requested</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <div>
        <label className={labelClasses}>Account Status</label>
        <select
          value={company.status || 'active'}
          onChange={(e) => updateField('status', e.target.value as Company['status'])}
          className={inputClasses}
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="pt-4 border-t border-zinc-200">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={company.featured || false}
            onChange={(e) => updateField('featured', e.target.checked)}
            className="w-4 h-4 text-tb-primary rounded border-zinc-300 focus:ring-tb-primary"
          />
          <div>
            <span className="block text-sm font-medium text-zinc-900">Featured Company</span>
            <span className="block text-xs text-zinc-500">Highlight this company on the homepage and partner directories.</span>
          </div>
        </label>
      </div>

      <div className="pt-4 border-t border-zinc-200 space-y-4">
        <h4 className="text-sm font-semibold text-zinc-900">Business Documents</h4>
        
        <div>
          <label className={labelClasses}>GST Number</label>
          <input
            type="text"
            value={company.gst_number || ''}
            onChange={(e) => updateField('gst_number', e.target.value)}
            className={inputClasses}
            placeholder="22AAAAA0000A1Z5"
          />
        </div>

        <div>
          <label className={labelClasses}>Years of Experience</label>
          <input
            type="number"
            min="0"
            value={company.years_of_experience || ''}
            onChange={(e) => updateField('years_of_experience', parseInt(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );
}
