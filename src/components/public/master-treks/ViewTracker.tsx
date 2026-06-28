"use client";

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/providers/RecentlyViewedProvider';

export function ViewTracker({ id }: { id: string }) {
  const { addViewedItem } = useRecentlyViewed();

  useEffect(() => {
    addViewedItem(id);
  }, [id, addViewedItem]);

  return null;
}
