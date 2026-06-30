import React from 'react';
import { Container } from '@/components/layout/Container';
import { createClient } from '@/lib/supabase/server';
import { WishlistTabs } from '@/components/account/WishlistTabs';

export const metadata = { title: 'Wishlist — TrekBazaar' };

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let wishlistItems: any[] = [];
  let masterWishlistItems: any[] = [];
  
  if (user) {
    // 1. Fetch Specific Bookings (Operator Treks)
    const { data: specificData } = await supabase
      .from('wishlists')
      .select('*, treks(*, companies(*), departures(*))')
      .eq('customer_id', user.id);
    
    if (specificData) {
      wishlistItems = specificData.map(item => item.treks).filter(Boolean);
    }

    // 2. Fetch Destinations (Master Treks)
    const { data: masterData } = await supabase
      .from('master_wishlists')
      .select('*, master_treks(*, category:categories(*), region:regions(*))')
      .eq('customer_id', user.id);
      
    if (masterData) {
      masterWishlistItems = masterData.map(item => item.master_treks).filter(Boolean);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Hero */}
      <div className="bg-white border-b border-zinc-100">
        <Container>
          <div className="pt-28 pb-8">
            <p className="text-sm font-semibold text-tb-primary mb-1 tracking-wide uppercase">Account</p>
            <h1 className="text-4xl font-black text-zinc-900">Wishlist</h1>
            <p className="text-zinc-500 mt-1.5 text-base">Keep track of the adventures you want to go on next.</p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-10">
          <WishlistTabs 
            wishlistItems={wishlistItems} 
            masterWishlistItems={masterWishlistItems} 
          />
        </div>
      </Container>
    </div>
  );
}
