"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

type MasterWishlistContextType = {
  masterWishlistIds: string[];
  addToMasterWishlist: (trekId: string) => Promise<void>;
  removeFromMasterWishlist: (trekId: string) => Promise<void>;
  isInMasterWishlist: (trekId: string) => boolean;
  isMasterLoading: boolean;
};

const MasterWishlistContext = createContext<MasterWishlistContextType | undefined>(undefined);

export function MasterWishlistProvider({ children }: { children: ReactNode }) {
  const [masterWishlistIds, setMasterWishlistIds] = useState<string[]>([]);
  const [isMasterLoading, setIsMasterLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let currentUser: string | null = null;
    let isMounted = true;

    const syncWithDb = async (uid: string | null) => {
      if (!isMounted) return;
      setIsMasterLoading(true);
      
      const storageKey = uid ? `tb_master_wishlist_${uid}` : 'tb_master_wishlist_anon';
      const local = localStorage.getItem(storageKey);
      let localIds: string[] = [];
      
      if (local) {
        try {
          localIds = JSON.parse(local);
          setMasterWishlistIds(localIds); // optimistic load for fast UI
        } catch (e) {
          console.error("Failed to parse local master wishlist", e);
        }
      } else if (!uid) {
        setMasterWishlistIds([]);
      }

      if (!uid) {
        setIsMasterLoading(false);
        return;
      }

      // DB Sync for authenticated user
      const { data, error } = await supabase.from('master_wishlists').select('master_trek_id').eq('customer_id', uid);
      if (data && !error && isMounted) {
        const dbIds = data.map(d => d.master_trek_id);
        
        // If there's an anon wishlist, merge it into the user's account
        const anon = localStorage.getItem('tb_master_wishlist_anon');
        let anonIds: string[] = [];
        if (anon) {
          try { anonIds = JSON.parse(anon); } catch (e) {}
        }

        // Merge local storage items (from current uid, and anon) that aren't in DB yet
        const toInsertCandidates = [...new Set([...localIds, ...anonIds])].filter((id) => !dbIds.includes(id));
        
        let validToInsert: string[] = [];
        if (toInsertCandidates.length > 0) {
          // Validate against master_treks table to prevent foreign key constraint violations
          const { data: validTreks } = await supabase.from('master_treks').select('id').in('id', toInsertCandidates);
          validToInsert = validTreks ? validTreks.map(t => t.id) : [];
          
          if (validToInsert.length > 0) {
            const insertData = validToInsert.map((id) => ({ customer_id: uid, master_trek_id: id }));
            const { error: insertError } = await supabase.from('master_wishlists').insert(insertData);
            if (insertError) console.error("Master Wishlist merge error", insertError);
          }
        }

        const mergedIds = [...new Set([...dbIds, ...validToInsert])];
        setMasterWishlistIds(mergedIds);
        localStorage.setItem(`tb_master_wishlist_${uid}`, JSON.stringify(mergedIds));
        
        // Clean up anon wishlist since it's merged
        if (anon) localStorage.removeItem('tb_master_wishlist_anon');
      }
      setIsMasterLoading(false);
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

  const addToMasterWishlist = useCallback(async (trekId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const storageKey = user ? `tb_master_wishlist_${user.id}` : 'tb_master_wishlist_anon';
    
    // Optimistic UI
    const newIds = [...new Set([...masterWishlistIds, trekId])];
    setMasterWishlistIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    if (user) {
      // Check existing to prevent 409 error in browser console
      const { data: existing } = await supabase
        .from('master_wishlists')
        .select('id')
        .match({ customer_id: user.id, master_trek_id: trekId })
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('master_wishlists').insert({ customer_id: user.id, master_trek_id: trekId });
        if (error) {
          // Revert on error
          const reverted = masterWishlistIds.filter(id => id !== trekId);
          setMasterWishlistIds(reverted);
          localStorage.setItem(storageKey, JSON.stringify(reverted));
        }
      }
    }
  }, [masterWishlistIds, supabase]);

  const removeFromMasterWishlist = useCallback(async (trekId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const storageKey = user ? `tb_master_wishlist_${user.id}` : 'tb_master_wishlist_anon';

    // Optimistic UI
    const previousIds = [...masterWishlistIds];
    const newIds = masterWishlistIds.filter(id => id !== trekId);
    setMasterWishlistIds(newIds);
    localStorage.setItem(storageKey, JSON.stringify(newIds));

    if (user) {
      const { error } = await supabase.from('master_wishlists').delete().match({ customer_id: user.id, master_trek_id: trekId });
      if (error) {
        // Revert on error
        setMasterWishlistIds(previousIds);
        localStorage.setItem(storageKey, JSON.stringify(previousIds));
      }
    }
  }, [masterWishlistIds, supabase]);

  const isInMasterWishlist = useCallback((trekId: string) => masterWishlistIds.includes(trekId), [masterWishlistIds]);

  return (
    <MasterWishlistContext.Provider value={{ masterWishlistIds, addToMasterWishlist, removeFromMasterWishlist, isInMasterWishlist, isMasterLoading }}>
      {children}
    </MasterWishlistContext.Provider>
  );
}

export function useMasterWishlist() {
  const context = useContext(MasterWishlistContext);
  if (context === undefined) {
    throw new Error('useMasterWishlist must be used within a MasterWishlistProvider');
  }
  return context;
}
