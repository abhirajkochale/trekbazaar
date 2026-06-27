"use client";

import React from 'react';
import type { Trek } from '@/lib/types';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function DetailsSection({ trek, updateField }: Props) {
  const fields = [
    { key: 'altitude', label: 'Max Altitude', placeholder: 'e.g. 14,100 ft' },
    { key: 'distance', label: 'Trekking Distance', placeholder: 'e.g. 26 km' },
    { key: 'base_camp', label: 'Base Camp', placeholder: 'e.g. Jobra' },
    { key: 'start_point', label: 'Start Point', placeholder: 'e.g. Manali' },
    { key: 'end_point', label: 'End Point', placeholder: 'e.g. Chatru' },
    { key: 'best_season', label: 'Best Season', placeholder: 'e.g. Mid June to Mid Oct' },
    { key: 'temperature', label: 'Temperature Range', placeholder: 'e.g. 12°C to 20°C (Day)' },
    { key: 'age_limit', label: 'Age Limit', placeholder: 'e.g. 12+ Years' },
    { key: 'fitness_level', label: 'Fitness Required', placeholder: 'e.g. High' },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className={labelClasses}>{field.label}</label>
          <input
            type="text"
            value={(trek[field.key as keyof Trek] as string) || ''}
            onChange={(e) => updateField(field.key as keyof Trek, e.target.value)}
            className={inputClasses}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  );
}
