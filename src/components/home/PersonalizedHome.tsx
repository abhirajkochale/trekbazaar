"use client";

import React from 'react';
import { useRecentlyViewed } from '@/providers/RecentlyViewedProvider';
import { TrekGridSection } from './TrekGridSection';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
}

export function PersonalizedHome({ masterTreks }: Props) {
  const { viewedIds } = useRecentlyViewed();

  // We filter from the pre-loaded masterTreks for performance.
  // In a massive app, we'd fetch these dynamically.
  
  const recentlyViewedTreks = viewedIds
    .map(id => masterTreks.find(t => t.id === id))
    .filter(Boolean);

  // Since wishlist stores `trek_id` (company packages), mapping them to `masterTreks` is a bit complex for MVP.
  // Instead, we just show recently viewed as the primary personalization.

  if (recentlyViewedTreks.length === 0) return null;

  return (
    <TrekGridSection 
      title="👀 Recently Viewed" 
      subtitle="Pick up where you left off." 
      treks={recentlyViewedTreks} 
    />
  );
}
