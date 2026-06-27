"use client";

import React from 'react';
import type { Company } from '@/lib/types';
import { Globe, Link as LinkIcon, Video } from 'lucide-react';

interface Props {
  company: Partial<Company>;
  updateField: <K extends keyof Company>(field: K, value: Company[K]) => void;
}

const inputClasses = "block w-full rounded-md border border-zinc-300 pl-10 pr-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700 mb-1";

export function SocialSection({ company, updateField }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>Website</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={company.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            className={inputClasses}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Instagram</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={company.instagram || ''}
            onChange={(e) => updateField('instagram', e.target.value)}
            className={inputClasses}
            placeholder="https://instagram.com/..."
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Facebook</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={company.facebook || ''}
            onChange={(e) => updateField('facebook', e.target.value)}
            className={inputClasses}
            placeholder="https://facebook.com/..."
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>YouTube</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Video className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={company.youtube || ''}
            onChange={(e) => updateField('youtube', e.target.value)}
            className={inputClasses}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>
    </div>
  );
}
