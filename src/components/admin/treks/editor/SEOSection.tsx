"use client";

import React from 'react';
import type { Trek } from '@/lib/types';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function SEOSection({ trek, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClasses}>SEO Title</label>
        <input
          type="text"
          value={trek.seo_title || ''}
          onChange={(e) => updateField('seo_title', e.target.value)}
          className={inputClasses}
          placeholder="Optimized title for search engines"
        />
        <p className="mt-1 text-xs text-zinc-500">
          {(trek.seo_title || '').length}/60 characters recommended
        </p>
      </div>

      <div>
        <label className={labelClasses}>SEO Description</label>
        <textarea
          rows={3}
          value={trek.seo_description || ''}
          onChange={(e) => updateField('seo_description', e.target.value)}
          className={inputClasses}
          placeholder="Compelling meta description for search results"
        />
        <p className="mt-1 text-xs text-zinc-500">
          {(trek.seo_description || '').length}/160 characters recommended
        </p>
      </div>

      <div>
        <label className={labelClasses}>Canonical URL</label>
        <input
          type="url"
          value={trek.canonical_url || ''}
          onChange={(e) => updateField('canonical_url', e.target.value)}
          className={inputClasses}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
