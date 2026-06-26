import React from 'react';
import type { Region, Trek } from '@/lib/types';
import { formatPrice } from '@/lib/format';

interface RegionSidebarProps {
  region: Region;
  treks: Trek[];
}

export function RegionSidebar({ region, treks }: RegionSidebarProps) {
  // Compute some quick stats from the treks
  const totalTreks = treks.length;
  
  let avgDuration = 0;
  let startingPrice = 0;
  
  if (totalTreks > 0) {
    avgDuration = Math.round(treks.reduce((acc, t) => acc + t.duration_days, 0) / totalTreks);
    startingPrice = Math.min(...treks.map(t => t.price_per_person));
  }

  return (
    <div className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 sticky top-[100px]">
      <h3 className="text-lg font-bold text-tb-text-primary mb-6 pb-4 border-b border-tb-border">
        Region Quick Stats
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-tb-text-secondary text-sm">Total Treks</span>
          <span className="font-semibold text-tb-text-primary text-sm">{totalTreks} active</span>
        </div>
        
        {region.altitude_range && (
          <div className="flex justify-between items-center">
            <span className="text-tb-text-secondary text-sm">Altitude</span>
            <span className="font-semibold text-tb-text-primary text-sm">{region.altitude_range}</span>
          </div>
        )}
        
        {totalTreks > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-tb-text-secondary text-sm">Avg. Duration</span>
              <span className="font-semibold text-tb-text-primary text-sm">{avgDuration} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tb-text-secondary text-sm">Starting from</span>
              <span className="font-semibold text-tb-primary text-sm">{formatPrice(startingPrice)}</span>
            </div>
          </>
        )}
      </div>

      <div className="bg-tb-sys-background p-4 rounded-xl border border-tb-border">
        <h4 className="text-xs font-bold text-tb-text-tertiary uppercase tracking-wider mb-2">Why Trek Here?</h4>
        <p className="text-sm text-tb-text-secondary">
          {region.name} offers some of the most spectacular high-altitude trekking in India, with well-established routes and rich local culture.
        </p>
      </div>
    </div>
  );
}
