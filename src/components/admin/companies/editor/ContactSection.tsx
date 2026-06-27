"use client";

import React from 'react';
import type { Company } from '@/lib/types';

interface Props {
  company: Partial<Company>;
  updateField: <K extends keyof Company>(field: K, value: Company[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function ContactSection({ company, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Contact Person</label>
          <input
            type="text"
            value={company.contact_person || ''}
            onChange={(e) => updateField('contact_person', e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Email Address</label>
          <input
            type="email"
            value={company.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input
            type="tel"
            value={company.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Emergency Contact</label>
          <input
            type="tel"
            value={company.emergency_contact || ''}
            onChange={(e) => updateField('emergency_contact', e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200 space-y-4">
        <h4 className="text-sm font-semibold text-zinc-900">Address</h4>
        
        <div>
          <label className={labelClasses}>Street Address</label>
          <input
            type="text"
            value={company.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            className={inputClasses}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>City</label>
            <input
              type="text"
              value={company.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>State / Region</label>
            <input
              type="text"
              value={company.state || ''}
              onChange={(e) => updateField('state', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
