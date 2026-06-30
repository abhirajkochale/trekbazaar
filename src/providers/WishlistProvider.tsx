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
    let currentUser: string | null = null;
    let isMounted = true;

    const syncWithDb = async (uid: string | null) => {
      if (!isMounted) return;
      setIsLoading(true);
      
      const storageKey = uid ? `tb_wishlist_${uid}` : 'tb_wishlist_anon';
      const local = localStorage.getItem(storageKey);
      let localIds: string[] = [];
      
      if (local) {
        try {
          localIds = JSON.parse(local);
          setWishlistIds(localIds); // optimistic load for fast UI
        } catch (e) {
          console.error("Failed to parse local wishlist", e);
        }
      } else if (!uid) {
        setWishlistIds([]);
      }

      if (!uid) {
        setIsLoading(false);
        return;
      }

      // DB Sync for authenticated user
      const { data, error } = await supabase.from('wishlists').select('trek_id').eq('customer_id', uid);
      if (data && !error && isMounted) {
        const dbIds = data.map(d => d.trek_id);
        
        // If there's an anon wishlist, merge it into the user's account
        const anon = localStorage.getItem('tb_wishlist_anon');
        let anonIds: string[] = [];
        if (anon) {
          try { anonIds = JSON.parse(anon); } catch (e) {}
        }

        // We also want to import the legacy 'tb_wishlist' if it exists to preserve user's old data
        const legacy = localStorage.getItem('tb_wishlist');
        let legacyIds: string[] = [];
        if (legacy) {
          try { legacyIds = JSON.parse(legacy); } catch (e) {}
        }

        // Merge local storage items (from current uid, anon, and legacy) that aren't in DB yet
        const toInsertCandidates = [...new Set([...localIds, ...anonIds, ...legacyIds])].filter((id) => !dbIds.includes(id));
        
        let validToInsert: string[] = [];
        if (toInsertCandidates.length > 0) {
          // Validate against treks table to prevent foreign key constraint violations
          const { data: validTreks } = await supabase.from('treks').select('id').in('id', toInsertCandidates);
          validToInsert = validTreks ? validTreks.map(t => t.id) : [];
          
          if (validToInsert.length > 0) {
            const insertData = validToInsert.map((id) => ({ customer_id: uid, trek_id: id }));
            const { error: insertError } = await supabase.from('wishlists').insert(insertData);
            if (insertError) console.error("Wishlist merge error", insertError);
          }
        }

        const mergedIds = [...new Set([...dbIds, ...validToInsert])];
        setWishlistIds(mergedIds);
        localStorage.setItem(`tb_wishlist_${uid}`, JSON.stringify(mergedIds));
        
        // Clean up anon and legacy wishlists since they are now merged
        if (anon) localStorage.removeItem('tb_wishlist_anon');
        if (legacy) localStorage.removeItem('tb_wishlist');
      }
      setIsLoading(false);
    };

    // Listen for auth state changes to dynamically load/clear wishlist
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const uid = session?.user?.id || null;
      if (uid !== currentUser || event === 'INITIAL_SESSION') {
        currentUser = uid;
        syncWithDb(uid);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const addToWishlist = useCallback(async (trekId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const storageKey = user ? `tb_wishlist_${user.id}` : 'tb_wishlist_anon';
    
    // Optimistic UI
    const newIds = [...new Set([...wishlistIds, trekId])];
    setWishlistIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    if (user) {
      // Check existing to prevent 409 error in browser console
      const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .match({ customer_id: user.id, trek_id: trekId })
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('wishlists').insert({ customer_id: user.id, trek_id: trekId });
        if (error) {
          // Revert on error
          const reverted = wishlistIds.filter(id => id !== trekId);
          setWishlistIds(reverted);
          localStorage.setItem(storageKey, JSON.stringify(reverted));
        }
      }
    }
  }, [wishlistIds, supabase]);

  const removeFromWishlist = useCallback(async (trekId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const storageKey = user ? `tb_wishlist_${user.id}` : 'tb_wishlist_anon';

    // Optimistic UI
    const previousIds = [...wishlistIds];
    const newIds = wishlistIds.filter(id => id !== trekId);
    setWishlistIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    if (user) {
      const { error } = await supabase.from('wishlists').delete().match({ customer_id: user.id, trek_id: trekId });
      if (error) {
        // Revert on error
        setWishlistIds(previousIds);
        localStorage.setItem(storageKey, JSON.stringify(previousIds));
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
