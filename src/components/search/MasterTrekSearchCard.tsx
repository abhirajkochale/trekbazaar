"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { difficultyLabel } from '@/lib/format';
import { Heart, CalendarDays } from 'lucide-react';
import { useWishlist } from '@/providers/WishlistProvider';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  className?: string;
  href?: string;
}

export function MasterTrekSearchCard({ masterTrek, className = '', href }: Props) {
  const [imgSrc, setImgSrc] = useState(masterTrek.cover_image || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800');
  const stats = masterTrek.aggregated || { lowestPrice: 0, companiesCount: 0, upcomingDeparturesCount: 0 };
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const cardHref = href || `/master-treks/${masterTrek.slug}`;

  return (
    <Link 
      href={cardHref} 
      className={`group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary ${className}`}
    >
      {/* 1. Hero Image (Airbnb style) */}
      <div className="relative aspect-[4/3] w-full bg-zinc-200 overflow-hidden rounded-2xl mb-4 transition-all duration-300 border border-zinc-100 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <Image 
          src={imgSrc} 
          alt={`Scenery from ${masterTrek.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc('https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800')}
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            if (isInWishlist(masterTrek.id)) {
              removeFromWishlist(masterTrek.id);
            } else {
              addToWishlist(masterTrek.id);
            }
          }}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-20 text-white drop-shadow-md hover:scale-110 active:scale-95 transition-transform w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/10"
          aria-label={isInWishlist(masterTrek.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-6 h-6 hover:fill-white transition-colors ${isInWishlist(masterTrek.id) ? 'fill-white' : ''}`} />
        </button>
        
        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {masterTrek.difficulty && (
            <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full shadow-sm backdrop-blur-md ${masterTrek.difficulty.toLowerCase() === 'easy' ? 'bg-green-100/90 text-green-800' : masterTrek.difficulty.toLowerCase() === 'moderate' ? 'bg-amber-100/90 text-amber-800' : 'bg-red-100/90 text-red-800'}`}>
              {difficultyLabel(masterTrek.difficulty)}
            </span>
          )}
          {masterTrek.category?.name && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-zinc-900 text-[11px] uppercase tracking-wider font-bold rounded-full shadow-sm">
              {masterTrek.category.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col px-1">
        {/* 2. Destination Name & Location */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[17px] font-bold text-zinc-900 line-clamp-1 group-hover:text-tb-primary transition-colors leading-tight">
            {masterTrek.name}
          </h3>
          <div className="flex items-center gap-1 text-[14px] font-bold text-zinc-900 shrink-0">
            ★ <span className="font-semibold">4.8</span>
          </div>
        </div>
        
        <p className="text-[14px] text-zinc-500 line-clamp-1 mb-2 font-medium">
          {masterTrek.region?.name || 'Himalayas, India'} • {masterTrek.duration_min === masterTrek.duration_max ? `${masterTrek.duration_min} Days` : `${masterTrek.duration_min}-${masterTrek.duration_max} Days`}
        </p>
        
        <div className="flex items-center gap-3 text-[13px] text-zinc-500 mb-2 font-medium">
          <span>{stats.companiesCount} verified operators</span>
          {stats.upcomingDeparturesCount > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-tb-primary" />
              {stats.upcomingDeparturesCount} departures
            </span>
          )}
        </div>

        {/* 5. Starting Price */}
        <div className="mt-1 flex items-baseline gap-1.5">
          {stats.lowestPrice > 0 ? (
            <>
              <span className="text-[18px] font-black text-zinc-900 tracking-tight">{formatPrice(stats.lowestPrice)}</span>
              <span className="text-[13px] font-medium text-zinc-500">onwards</span>
            </>
          ) : (
            <span className="text-[14px] font-medium text-zinc-500">Price not available</span>
          )}
        </div>
      </div>
    </Link>
  );
}
