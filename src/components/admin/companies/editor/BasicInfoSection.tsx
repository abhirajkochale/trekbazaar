"use client";

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { Company } from '@/lib/types';
import { slugify } from '@/lib/format';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface Props {
  company: Partial<Company>;
  updateField: <K extends keyof Company>(field: K, value: Company[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function BasicInfoSection({ company, updateField }: Props) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateField('name', newName);
    if (!company.id) {
      updateField('slug', slugify(newName));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={company.name || ''}
            onChange={handleNameChange}
            className={inputClasses}
            placeholder="e.g. Himalayan Explorers"
          />
        </div>
        <div>
          <label className={labelClasses}>Slug <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={company.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClasses}
            placeholder="e.g. himalayan-explorers"
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Company Description</label>
        <textarea
          rows={4}
          value={company.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          className={inputClasses}
          placeholder="Detailed description of the company..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200">
        <div>
          <label className={labelClasses + " mb-2"}>Company Logo</label>
          <ImageUpload 
            value={company.logo_url || ''} 
            onChange={(url) => updateField('logo_url', url)} 
            folder="company-logos"
            label="Upload Logo"
          />
        </div>
        
        <div>
          <label className={labelClasses + " mb-2"}>Cover Image</label>
          <ImageUpload 
            value={company.cover_image_url || ''} 
            onChange={(url) => updateField('cover_image_url', url)} 
            folder="company-covers"
            label="Upload Cover"
          />
        </div>
      </div>
    </div>
  );
}
