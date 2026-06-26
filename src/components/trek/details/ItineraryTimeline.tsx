import React from 'react';
import type { Trek } from '@/lib/types';

interface ItineraryTimelineProps {
  trek: Trek;
}

export function ItineraryTimeline({ trek }: ItineraryTimelineProps) {
  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-tb-text-primary mb-6">Itinerary</h2>
      
      <div className="relative border-l-2 border-tb-border ml-3 md:ml-4 space-y-8 pb-4">
        {[...Array(Math.min(trek.duration_days, 5))].map((_, i) => (
          <div key={i} className="relative pl-8">
            <div className="absolute w-4 h-4 bg-white border-2 border-tb-primary rounded-full -left-[9px] top-1"></div>
            <h4 className="text-lg font-bold text-tb-text-primary mb-2">Day {i + 1}</h4>
            <p className="text-tb-text-secondary">
              Detailed itinerary information for day {i + 1} will be displayed here. 
              Currently, this data is pending synchronization with the operator.
            </p>
          </div>
        ))}
        {trek.duration_days > 5 && (
           <div className="relative pl-8">
            <div className="absolute w-4 h-4 bg-white border-2 border-tb-border rounded-full -left-[9px] top-1"></div>
            <p className="text-tb-text-tertiary italic">
              + {trek.duration_days - 5} more days...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
