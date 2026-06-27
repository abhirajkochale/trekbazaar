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
    <div className={`group flex flex-col overflow-hidden rounded-xl border border-tb-border bg-white shadow-tb-subtle transition-shadow hover:shadow-tb-medium ${className}`}>
      
      {/* 1. Hero Image */}
      <Link 
        href={`/master-treks/${masterTrek.slug}`} 
        className="relative aspect-[16/10] w-full bg-tb-sys-background overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
      >
        <Image 
          src={imageUrl} 
          alt={`Scenery from ${masterTrek.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-tb-ease group-hover:scale-105"
        />
        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          {masterTrek.category?.name && (
            <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-md border border-white/20">
              {masterTrek.category.name}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* 2. Destination Name */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold text-tb-text-primary line-clamp-1">
            <Link href={`/master-treks/${masterTrek.slug}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-sm">
              {masterTrek.name}
            </Link>
          </h3>
          {masterTrek.difficulty && (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${difficultyBadgeClasses(masterTrek.difficulty.toLowerCase())}`}>
              {difficultyLabel(masterTrek.difficulty.toLowerCase())}
            </span>
          )}
        </div>
        
        {/* 3. Region */}
        <div className="flex items-center text-sm text-tb-text-secondary mb-4">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{masterTrek.region?.name || 'Various Regions'}</span>
        </div>

        {/* 4. Stats Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-5">
          <div className="flex items-center text-sm text-tb-text-secondary">
            <Building2 className="w-4 h-4 mr-1.5 text-tb-primary" />
            <span className="font-medium text-tb-text-primary mr-1">{stats.companiesCount}</span>
            <span>Operators</span>
          </div>
          <div className="flex items-center text-sm text-tb-text-secondary">
            <CalendarDays className="w-4 h-4 mr-1.5 text-tb-primary" />
            <span className="font-medium text-tb-text-primary mr-1">{stats.upcomingDeparturesCount}</span>
            <span>Dates</span>
          </div>
          <div className="flex items-center text-sm text-tb-text-secondary col-span-2">
            <svg className="w-4 h-4 mr-1.5 text-tb-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{masterTrek.duration_min === masterTrek.duration_max ? `${masterTrek.duration_min} Days Typical` : `${masterTrek.duration_min}-${masterTrek.duration_max} Days Typical`}</span>
          </div>
          {masterTrek.best_season && (
            <div className="flex items-center text-sm text-tb-text-secondary col-span-2">
              <svg className="w-4 h-4 mr-1.5 text-tb-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <span className="line-clamp-1">{masterTrek.best_season}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4 border-t border-zinc-100">
          {/* 5. Starting Price */}
          <div>
            <span className="text-xs text-tb-text-tertiary block mb-0.5">Starting from</span>
            {stats.lowestPrice > 0 ? (
              <span className="text-xl font-bold text-tb-text-primary">{formatPrice(stats.lowestPrice)}</span>
            ) : (
              <span className="text-sm font-medium text-zinc-500">Price not available</span>
            )}
          </div>
          
          {/* 6. View CTA */}
          <Link 
            href={`/master-treks/${masterTrek.slug}`} 
            tabIndex={-1} 
            className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-lg active:scale-95 bg-tb-primary text-white hover:bg-tb-primary-hover shadow-sm h-10 px-5 text-sm"
          >
            Compare Companies
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
