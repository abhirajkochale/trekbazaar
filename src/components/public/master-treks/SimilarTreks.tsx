"use client";

import React from 'react';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  similarTreks: any[];
}

export function SimilarTreks({ similarTreks }: Props) {
  if (!similarTreks || similarTreks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900">Similar Treks</h2>
        <p className="text-zinc-500 mt-2 text-lg">Explore other adventures you might love.</p>
      </div>

      {/* Mobile: CSS Scroll Snap Carousel | Desktop: Grid */}
      <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 snap-x snap-mandatory hide-scrollbar">
        {similarTreks.map((trek) => (
          <div key={trek.id} className="w-[85vw] sm:w-[60vw] md:w-auto shrink-0 snap-center">
            <MasterTrekSearchCard masterTrek={trek} />
          </div>
        ))}
      </div>
    </div>
  );
}
