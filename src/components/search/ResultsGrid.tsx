import React from 'react';
import { TrekCard } from '@/components/trek/TrekCard';
import type { Trek } from '@/lib/types';

interface ResultsGridProps {
  treks: Trek[];
}

export function ResultsGrid({ treks }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
      {treks.map((trek) => (
        <TrekCard key={trek.id} trek={trek} />
      ))}
    </div>
  );
}
