"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type RecentlyViewedContextType = {
  viewedIds: string[];
  addViewedItem: (id: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    const local = localStorage.getItem('tb_recently_viewed');
    if (local) {
      try {
        setViewedIds(JSON.parse(local));
      } catch (e) {
        console.error("Failed to parse recently viewed", e);
      }
    }
  }, []);

  const addViewedItem = (id: string) => {
    setViewedIds(prev => {
      // Remove if it exists to move it to the front
      const filtered = prev.filter(item => item !== id);
      const updated = [id, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem('tb_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewedIds, addViewedItem }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
