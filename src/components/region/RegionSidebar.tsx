"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { Region } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { SmoothCounter } from '@/components/ui/SmoothCounter';

interface RegionSidebarProps {
  region: Region;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
}

export function RegionSidebar({ region, treks }: RegionSidebarProps) {
  const totalTreks = treks.length;
  
  let avgDuration = 0;
  let avgPrice = 0;
  
  const difficultyCounts = { easy: 0, moderate: 0, difficult: 0, extreme: 0 };
  
  if (totalTreks > 0) {
    avgDuration = Math.round(treks.reduce((acc, t) => acc + (t.duration_max || 0), 0) / totalTreks);
    avgPrice = Math.round(treks.reduce((acc, t) => acc + (t.aggregated?.lowestPrice || 0), 0) / totalTreks);
    
    treks.forEach(t => {
      // master_treks use Title Case for difficulty (e.g., 'Easy', 'Moderate')
      const diff = t.difficulty?.toLowerCase();
      if (diff && difficultyCounts[diff as keyof typeof difficultyCounts] !== undefined) {
        difficultyCounts[diff as keyof typeof difficultyCounts]++;
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 sticky top-[100px]">
      <h3 className="text-lg font-bold text-tb-text-primary mb-6 pb-4 border-b border-tb-border">
        Region Overview
      </h3>

      <div className="space-y-5 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-tb-text-secondary text-sm">Total Treks</span>
          <span className="font-semibold text-tb-text-primary text-sm">
            <SmoothCounter value={totalTreks} /> active
          </span>
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
              <span className="font-semibold text-tb-text-primary text-sm">
                <SmoothCounter value={avgDuration} /> days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tb-text-secondary text-sm">Average Price</span>
              <span className="font-semibold text-tb-primary text-sm">
                <SmoothCounter value={avgPrice} format={formatPrice} />
              </span>
            </div>
          </>
        )}
      </div>

      {totalTreks > 0 && (
        <div className="mb-8 border-t border-tb-border pt-6">
          <h4 className="text-sm font-semibold text-tb-text-primary mb-4">Difficulty Distribution</h4>
          
          {/* Progress Bar Container */}
          <div className="h-3 w-full bg-tb-sys-background rounded-full overflow-hidden flex gap-0.5 mb-3">
            {difficultyCounts.easy > 0 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(difficultyCounts.easy / totalTreks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-green-500" 
                title="Easy"
              />
            )}
            {difficultyCounts.moderate > 0 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(difficultyCounts.moderate / totalTreks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                className="h-full bg-blue-500" 
                title="Moderate"
              />
            )}
            {difficultyCounts.difficult > 0 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(difficultyCounts.difficult / totalTreks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-orange-500" 
                title="Difficult"
              />
            )}
            {difficultyCounts.extreme > 0 && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(difficultyCounts.extreme / totalTreks) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-red-600" 
                title="Extreme"
              />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-2 text-xs text-tb-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 block shrink-0" />
              <span>Easy ({difficultyCounts.easy})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block shrink-0" />
              <span>Moderate ({difficultyCounts.moderate})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 block shrink-0" />
              <span>Difficult ({difficultyCounts.difficult})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 block shrink-0" />
              <span>Extreme ({difficultyCounts.extreme})</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-tb-sys-background p-4 rounded-xl border border-tb-border">
        <h4 className="text-xs font-bold text-tb-text-tertiary uppercase tracking-wider mb-2">Why Trek Here?</h4>
        <p className="text-sm text-tb-text-secondary">
          {region.name} offers some of the most spectacular high-altitude trekking in India, with well-established routes and rich local culture.
        </p>
      </div>
    </div>
  );
}
