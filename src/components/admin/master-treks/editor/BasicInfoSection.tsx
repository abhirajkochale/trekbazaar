"use client";

import React from 'react';
import type { MasterTrek, MasterTrekCategory, Region } from '@/lib/types';
import { slugify } from '@/lib/format';

interface Props {
  masterTrek: Partial<MasterTrek>;
  updateField: <K extends keyof MasterTrek>(field: K, value: MasterTrek[K]) => void;
  categories: MasterTrekCategory[];
  regions: Region[];
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary bg-white";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function BasicInfoSection({ masterTrek, updateField, categories, regions }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={masterTrek.name || ''}
            onChange={(e) => {
              updateField('name', e.target.value);
              if (!masterTrek.id) {
                updateField('slug', slugify(e.target.value));
              }
            }}
            className={inputClasses}
            placeholder="e.g. Kedarkantha"
          />
        </div>

        <div>
          <label className={labelClasses}>Slug <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={masterTrek.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-zinc-500">Auto-generated. Must be unique.</p>
        </div>
        
        <div>
          <label className={labelClasses}>Category</label>
          <select
            value={masterTrek.category_id || ''}
            onChange={(e) => updateField('category_id', e.target.value || null)}
            className={inputClasses}
          >
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Region</label>
          <select
            value={masterTrek.region_id || ''}
            onChange={(e) => updateField('region_id', e.target.value || null)}
            className={inputClasses}
          >
            <option value="">-- Select Region --</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Country</label>
          <input
            type="text"
            value={masterTrek.country || 'India'}
            onChange={(e) => updateField('country', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>State</label>
          <input
            type="text"
            value={masterTrek.state || ''}
            onChange={(e) => updateField('state', e.target.value)}
            className={inputClasses}
            placeholder="e.g. Uttarakhand"
          />
        </div>

        <div>
          <label className={labelClasses}>Status</label>
          <select
            value={masterTrek.status || 'draft'}
            onChange={(e) => updateField('status', e.target.value as MasterTrek["status"])}
            className={inputClasses}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Overview</label>
        <textarea
          rows={4}
          value={masterTrek.overview || ''}
          onChange={(e) => updateField('overview', e.target.value)}
          className={inputClasses}
          placeholder="Brief description of the trek..."
        />
      </div>
    </div>
  );
}
