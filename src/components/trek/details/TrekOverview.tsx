import React from 'react';
import type { Trek } from '@/lib/types';

interface TrekOverviewProps {
  trek: Trek;
}

export function TrekOverview({ trek }: TrekOverviewProps) {
  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-tb-text-primary mb-6">About this Trek</h2>
      
      <div className="prose prose-tb max-w-none text-tb-text-secondary">
        {trek.description ? (
          <p className="whitespace-pre-line leading-relaxed">
            {trek.description}
          </p>
        ) : (
          <p className="italic text-tb-text-tertiary">
            No detailed description available for this trek yet. Contact the operator for more information.
          </p>
        )}
      </div>
    </section>
  );
}
