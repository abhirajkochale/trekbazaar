"use client";

import React from 'react';
import type { Trek, Company } from '@/lib/types';
import { slugify } from '@/lib/format';
import Link from 'next/link';
import { SearchableMasterTrekSelect } from '../../shared/SearchableMasterTrekSelect';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
  companies?: Company[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks?: any[];
  isCompanyPortal?: boolean;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function BasicInfoSection({ trek, updateField, companies = [], masterTreks = [], isCompanyPortal }: Props) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    updateField('title', newTitle);
    if (!trek.id) { // Only auto-slug for new treks to prevent breaking existing URLs
      updateField('slug', slugify(newTitle));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={trek.title || ''}
            onChange={handleTitleChange}
            className={inputClasses}
            placeholder="e.g. Hampta Pass Trek"
          />
        </div>
        <div>
          <label className={labelClasses}>Slug <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={trek.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClasses}
            placeholder="e.g. hampta-pass-trek"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Destination <span className="text-red-500">*</span></label>
          <SearchableMasterTrekSelect 
            value={trek.master_trek_id || null}
            onChange={(val) => updateField('master_trek_id', val)}
            masterTreks={masterTreks}
          />
        </div>

        {!isCompanyPortal && (
          <div>
            <label className={labelClasses}>Company (Partner) <span className="text-red-500">*</span></label>
            <select
              value={trek.company_id || ''}
              onChange={(e) => updateField('company_id', e.target.value || null)}
              className={inputClasses}
              required
            >
              <option value="">Select a Company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelClasses}>Region</label>
          <input
            type="text"
            list="region-options"
            value={trek.region || ''}
            onChange={(e) => updateField('region', e.target.value)}
            className={inputClasses}
            placeholder="e.g. Uttarakhand"
          />
          <datalist id="region-options">
            <option value="Uttarakhand" />
            <option value="Himachal Pradesh" />
            <option value="Kashmir" />
            <option value="Ladakh" />
            <option value="Sikkim" />
            <option value="Nepal" />
            <option value="Meghalaya" />
            <option value="Western Ghats" />
          </datalist>
        </div>
        <div>
          <label className={labelClasses}>Difficulty</label>
          <select
            value={trek.difficulty || 'moderate'}
            onChange={(e) => updateField('difficulty', e.target.value as Trek['difficulty'])}
            className={inputClasses}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Status</label>
          <select
            value={trek.status || 'draft'}
            onChange={(e) => updateField('status', e.target.value as Trek['status'])}
            className={inputClasses}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={trek.duration_days || ''}
            onChange={(e) => updateField('duration_days', parseInt(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Price Per Person (₹)</label>
          <input
            type="number"
            min="0"
            value={trek.price_per_person || ''}
            onChange={(e) => updateField('price_per_person', parseInt(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Short Description</label>
        <textarea
          rows={2}
          value={trek.short_description || ''}
          onChange={(e) => updateField('short_description', e.target.value)}
          className={inputClasses}
          placeholder="Brief 1-2 sentence summary for cards..."
        />
      </div>

      <div>
        <label className={labelClasses}>Full Description</label>
        <textarea
          rows={5}
          value={trek.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          className={inputClasses}
          placeholder="Detailed description of the trek..."
        />
      </div>
    </div>
  );
}
