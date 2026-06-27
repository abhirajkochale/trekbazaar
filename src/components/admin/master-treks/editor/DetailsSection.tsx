"use client";

import React from 'react';
import type { MasterTrek } from '@/lib/types';

interface Props {
  masterTrek: Partial<MasterTrek>;
  updateField: <K extends keyof MasterTrek>(field: K, value: MasterTrek[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary bg-white";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function DetailsSection({ masterTrek, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClasses}>Difficulty</label>
        <select
          value={masterTrek.difficulty || ''}
          onChange={(e) => updateField('difficulty', e.target.value as MasterTrek["difficulty"])}
          className={inputClasses}
        >
          <option value="">-- Select --</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Difficult">Difficult</option>
          <option value="Extreme">Extreme</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Min Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={masterTrek.duration_min || ''}
            onChange={(e) => updateField('duration_min', parseInt(e.target.value) || null)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Max Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={masterTrek.duration_max || ''}
            onChange={(e) => updateField('duration_max', parseInt(e.target.value) || null)}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Altitude</label>
        <input
          type="text"
          value={masterTrek.altitude || ''}
          onChange={(e) => updateField('altitude', e.target.value)}
          className={inputClasses}
          placeholder="e.g. 12,500 ft"
        />
      </div>

      <div>
        <label className={labelClasses}>Best Season</label>
        <input
          type="text"
          value={masterTrek.best_season || ''}
          onChange={(e) => updateField('best_season', e.target.value)}
          className={inputClasses}
          placeholder="e.g. Dec - April"
        />
      </div>
    </div>
  );
}
