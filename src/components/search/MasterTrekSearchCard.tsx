"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import { Heart, CalendarDays } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  className?: string;
}

export function MasterTrekSearchCard({ masterTrek, className = '' }: Props) {
  const [imgSrc, setImgSrc] = useState(masterTrek.cover_image || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800');
  const stats = masterTrek.aggregated || { lowestPrice: 0, companiesCount: 0, upcomingDeparturesCount: 0 };

  return (
    <Link 
      href={`/master-treks/${masterTrek.slug}`} 
      className={`group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary ${className}`}
    >
      {/* 1. Hero Image (Airbnb style square/4:3) */}
      <div className="relative aspect-[4/3] w-full bg-zinc-200 overflow-hidden rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-shadow">
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
          onClick={(e) => { e.preventDefault(); /* TODO: Add wishlist logic */ }}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-20 text-white drop-shadow-md hover:scale-110 active:scale-95 transition-transform w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/10"
          aria-label="Add to wishlist"
        >
          <Heart className="w-6 h-6 hover:fill-white transition-colors" />
        </button>
        
        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {masterTrek.difficulty && (
            <span className={`px-2 py-1 text-xs font-bold rounded-md shadow-sm ${difficultyBadgeClasses(masterTrek.difficulty)}`}>
              {difficultyLabel(masterTrek.difficulty)}
            </span>
          )}
          {masterTrek.category?.name && (
            <span className="px-2 py-1 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold rounded-md shadow-sm">
              {masterTrek.category.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {/* 2. Destination Name & Location */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-tb-primary transition-colors">
            {masterTrek.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-zinc-900 shrink-0">
            ★ <span className="font-semibold">4.8</span>
          </div>
        </div>
        
        <p className="text-sm text-zinc-500 line-clamp-1 mb-1">
          {masterTrek.region?.name || 'Himalayas, India'} • {masterTrek.duration_min === masterTrek.duration_max ? `${masterTrek.duration_min} Days` : `${masterTrek.duration_min}-${masterTrek.duration_max} Days`}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-zinc-500 mb-2">
          <span>{stats.companiesCount} verified operators</span>
          {stats.upcomingDeparturesCount > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {stats.upcomingDeparturesCount} departures
            </span>
          )}
        </div>

        {/* 5. Starting Price */}
        <div className="mt-1 flex items-baseline gap-1">
          {stats.lowestPrice > 0 ? (
            <>
              <span className="text-base font-bold text-zinc-900">{formatPrice(stats.lowestPrice)}</span>
              <span className="text-sm text-zinc-500">onwards</span>
            </>
          ) : (
            <span className="text-sm font-medium text-zinc-500">Price not available</span>
          )}
        </div>
      </div>
    </Link>
  );
}
