"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

type WishlistContextType = {
  wishlistIds: string[];
  addToWishlist: (trekId: string) => Promise<void>;
  removeFromWishlist: (trekId: string) => Promise<void>;
  isInWishlist: (trekId: string) => boolean;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Load from local storage immediately for fast UI
    const local = localStorage.getItem('tb_wishlist');
    if (local) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWishlistIds(JSON.parse(local));
      } catch (e) {
        console.error("Failed to parse wishlist from local storage", e);
      }
    }

    // 2. Sync with Supabase if logged in
    const syncWithDb = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('wishlists').select('trek_id').eq('customer_id', user.id);
      if (data && !error) {
        const dbIds = data.map(d => d.trek_id);
        
        // Merge local storage items that aren't in DB yet (if they logged in for the first time on this device)
        const localIds = local ? JSON.parse(local) : [];
        const toInsert = localIds.filter((id: string) => !dbIds.includes(id));
        
        if (toInsert.length > 0) {
          const insertData = toInsert.map((id: string) => ({ customer_id: user.id, trek_id: id }));
          // We can ignore errors on insert (e.g. if the trek_id is invalid)
          await supabase.from('wishlists').insert(insertData).select();
        }

        const mergedIds = [...new Set([...dbIds, ...toInsert])];
        setWishlistIds(mergedIds);
        localStorage.setItem('tb_wishlist', JSON.stringify(mergedIds));
      }
      setIsLoading(false);
    };

    syncWithDb();
  }, [supabase]);

  const addToWishlist = useCallback(async (trekId: string) => {
    // Optimistic UI
    const newIds = [...new Set([...wishlistIds, trekId])];
    setWishlistIds(newIds);
    localStorage.setItem('tb_wishlist', JSON.stringify(newIds));

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('wishlists').insert({ customer_id: user.id, trek_id: trekId });
      if (error) {
        // Revert on error
        const reverted = wishlistIds.filter(id => id !== trekId);
        setWishlistIds(reverted);
        localStorage.setItem('tb_wishlist', JSON.stringify(reverted));
      }
    }
  }, [wishlistIds, supabase]);

  const removeFromWishlist = useCallback(async (trekId: string) => {
    // Optimistic UI
    const previousIds = [...wishlistIds];
    const newIds = wishlistIds.filter(id => id !== trekId);
    setWishlistIds(newIds);
    localStorage.setItem('tb_wishlist', JSON.stringify(newIds));

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('wishlists').delete().match({ customer_id: user.id, trek_id: trekId });
      if (error) {
        // Revert on error
        setWishlistIds(previousIds);
        localStorage.setItem('tb_wishlist', JSON.stringify(previousIds));
      }
    }
  }, [wishlistIds, supabase]);

  const isInWishlist = useCallback((trekId: string) => wishlistIds.includes(trekId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
