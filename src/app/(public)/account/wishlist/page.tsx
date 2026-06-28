import React from 'react';
import { Heart, Compass } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { createClient } from '@/lib/supabase/server';
import { MarketplaceCard } from '@/components/public/master-treks/MarketplaceCard';

export const metadata = { title: 'Wishlist — TrekBazaar' };

export default async function WishlistPage() {
  // In a full implementation, we query the `wishlists` relational table
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let wishlistItems: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('wishlists')
      .select('*, treks(*, companies(*), departures(*))')
      .eq('customer_id', user.id);
    
    if (data) {
      wishlistItems = data.map(item => item.treks).filter(Boolean);
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
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-zinc-100 p-16 text-center shadow-sm max-w-4xl mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Your wishlist is empty</h3>
              <p className="text-zinc-500 mt-2 mb-8 max-w-sm mx-auto">
                Explore the marketplace and save treks you love to easily find them later.
              </p>
              <Link href="/search" className="inline-flex items-center gap-2 bg-tb-primary text-white font-bold py-3 px-8 rounded-2xl hover:bg-tb-primary-hover transition-colors shadow-sm shadow-tb-primary/20">
                <Compass className="w-4 h-4" /> Explore Treks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(pkg => (
                <MarketplaceCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
