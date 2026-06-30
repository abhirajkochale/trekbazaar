"use client";

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  inclusions: string[];
  exclusions: string[];
}

export function InclusionsExclusions({ inclusions, exclusions }: Props) {
  if (inclusions.length === 0 && exclusions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900">What&apos;s Included</h2>
        <p className="text-zinc-500 mt-2 text-lg">Everything you need to know about what is covered.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Inclusions */}
        <div>
          <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-500" />
            Included in most packages
          </h3>
          {inclusions.length > 0 ? (
            <ul className="space-y-4">
              {inclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">No inclusions explicitly listed.</p>
          )}
        </div>

        {/* Exclusions */}
        <div>
          <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-zinc-500" />
            Not Included
          </h3>
          {exclusions.length > 0 ? (
            <ul className="space-y-4">
              {exclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-600 font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">No exclusions explicitly listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
