import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import { MapPin, Building2, CalendarDays } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  className?: string;
}

export function MasterTrekSearchCard({ masterTrek, className = '' }: Props) {
  const imageUrl = masterTrek.cover_image || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800';
  const stats = masterTrek.aggregated;

  return (
    <Link 
      href={`/master-treks/${masterTrek.slug}`} 
      className={`group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary ${className}`}
    >
      {/* 1. Hero Image (Airbnb style square/4:3) */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden rounded-2xl mb-3 shadow-sm">
        <Image 
          src={imageUrl} 
          alt={`Scenery from ${masterTrek.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Favorite Icon Placeholder */}
        <div className="absolute top-3 right-3 z-10 text-white drop-shadow-md hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
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
        
        <p className="text-sm text-zinc-500 mb-2">
          {stats.companiesCount} verified operators
        </p>

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
