"use client";

import React, { useState } from 'react';
import { Heart, Compass, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MarketplaceCard } from '@/components/public/master-treks/MarketplaceCard';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';

interface WishlistTabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wishlistItems: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterWishlistItems: any[];
}

export function WishlistTabs({ wishlistItems, masterWishlistItems }: WishlistTabsProps) {
  const [activeTab, setActiveTab] = useState<'destinations' | 'packages'>('destinations');

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-200 mb-8">
        <button
          onClick={() => setActiveTab('destinations')}
          className={`pb-4 text-sm font-bold transition-colors relative ${
            activeTab === 'destinations' ? 'text-tb-primary' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Destinations ({masterWishlistItems.length})
          {activeTab === 'destinations' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-tb-primary rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-4 text-sm font-bold transition-colors relative ${
            activeTab === 'packages' ? 'text-tb-primary' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Specific Bookings ({wishlistItems.length})
          {activeTab === 'packages' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-tb-primary rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'destinations' && (
        <div>
          {masterWishlistItems.length === 0 ? (
            <EmptyState 
              title="No destinations saved yet"
              description="Explore the marketplace and save destinations you want to visit in the future."
              href="/search"
              buttonText="Explore Destinations"
              icon={<MapPin className="w-8 h-8 text-tb-primary" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterWishlistItems.map(trek => (
                <MasterTrekSearchCard key={trek.id} masterTrek={trek} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'packages' && (
        <div>
          {wishlistItems.length === 0 ? (
            <EmptyState 
              title="No specific bookings saved"
              description="Found a specific operator and date you like? Save it here to book later."
              href="/search"
              buttonText="Find Packages"
              icon={<Heart className="w-8 h-8 text-red-500" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(pkg => (
                <MarketplaceCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, description, href, buttonText, icon }: { title: string, description: string, href: string, buttonText: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-zinc-100 p-16 text-center shadow-sm max-w-4xl mx-auto">
      <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
      <p className="text-zinc-500 mt-2 mb-8 max-w-sm mx-auto">
        {description}
      </p>
      <Link href={href} className="inline-flex items-center gap-2 bg-tb-primary text-white font-bold py-3 px-8 rounded-full hover:bg-tb-primary-hover transition-colors shadow-sm shadow-tb-primary/20 active:scale-95">
        <Compass className="w-4 h-4" /> {buttonText}
      </Link>
    </div>
  );
}
