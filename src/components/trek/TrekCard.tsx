import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDuration, difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import type { Trek } from '@/lib/types';

export type TrekCardVariant = 'default' | 'compact';

export interface TrekCardProps {
  trek: Trek;
  variant?: TrekCardVariant;
  className?: string;
}

// Icon for Duration (Clock)
const ClockIcon = () => (
  <svg className="w-4 h-4 mr-1 text-tb-text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Icon for Region (Map Pin)
const PinIcon = () => (
  <svg className="w-4 h-4 mr-1 text-tb-text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function TrekCard({ trek, variant = 'default', className = '' }: TrekCardProps) {
  const isCompact = variant === 'compact';
  
  // Provide a fallback image just in case
  const imageUrl = trek.cover_image_url || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800';

  if (isCompact) {
    return (
      <Link 
        href={`/treks/${trek.slug}`}
        className={`group flex flex-row overflow-hidden rounded-tb-md border border-tb-border bg-white shadow-tb-subtle transition-shadow hover:shadow-tb-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary ${className}`}
        aria-label={`View details for ${trek.title}`}
      >
        <div className="relative w-1/3 min-w-[120px] max-w-[200px] bg-tb-sys-background shrink-0">
          <Image 
            src={imageUrl} 
            alt={trek.title}
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover transition-transform duration-tb-slow ease-tb-ease group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-h3 text-tb-text-primary mb-1 line-clamp-1">{trek.title}</h3>
          
          <div className="flex items-center text-sm text-tb-text-secondary mb-3">
            <PinIcon />
            <span className="line-clamp-1">{trek.region}</span>
          </div>
          
          <div className="flex items-center gap-3 mb-auto">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyBadgeClasses(trek.difficulty)}`}>
              {difficultyLabel(trek.difficulty)}
            </span>
            <div className="flex items-center text-sm text-tb-text-secondary">
              <ClockIcon />
              <span>{formatDuration(trek.duration_days)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs text-tb-text-tertiary block mb-0.5">from</span>
              <span className="text-lg font-bold text-tb-text-primary">{formatPrice(trek.price_per_person)}</span>
            </div>
            
            <div className="text-sm font-medium text-tb-primary group-hover:underline flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default Variant (Vertical)
  // Shared interactive button styles mapped manually to avoid nesting <button> in <Link>
  const buttonStyleClasses = "mt-2 inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-tb-md active:scale-[0.98] bg-tb-primary text-white hover:bg-tb-primary-hover shadow-tb-subtle border border-transparent h-10 px-4 py-2 text-sm w-full";

  return (
    <div className={`group flex flex-col overflow-hidden rounded-tb-md border border-tb-border bg-white shadow-tb-subtle transition-shadow hover:shadow-tb-medium ${className}`}>
      {/* 1. Hero Image */}
      <Link 
        href={`/treks/${trek.slug}`} 
        className="relative aspect-[16/10] w-full bg-tb-sys-background overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
        aria-label={`View image of ${trek.title}`}
      >
        <Image 
          src={imageUrl} 
          alt={`Scenery from ${trek.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-tb-slow ease-tb-ease group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {/* 2. Trek Name */}
        <h3 className="text-h3 text-tb-text-primary mb-1 line-clamp-1">
          <Link href={`/treks/${trek.slug}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-sm">
            {trek.title}
          </Link>
        </h3>
        
        {/* 3. Region */}
        <div className="flex items-center text-sm text-tb-text-secondary mb-4">
          <PinIcon />
          <span className="line-clamp-1">{trek.region}</span>
        </div>

        {/* 4. Difficulty + Duration */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-tb-border">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyBadgeClasses(trek.difficulty)}`}>
            {difficultyLabel(trek.difficulty)}
          </span>
          <div className="flex items-center text-sm text-tb-text-secondary">
            <ClockIcon />
            <span>{formatDuration(trek.duration_days)}</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 mb-4">
          {/* 5. Starting Price */}
          <div>
            <span className="text-xs text-tb-text-tertiary block mb-0.5">Starting from</span>
            <span className="text-xl font-bold text-tb-text-primary">{formatPrice(trek.price_per_person)}</span>
          </div>
          
          {/* 6. Operator Name */}
          <div className="text-right">
            <span className="text-xs text-tb-text-tertiary block mb-0.5">Operated by</span>
            <span className="text-sm font-medium text-tb-text-secondary max-w-[120px] line-clamp-1">
              {trek.operator_name || 'TrekBazaar'}
            </span>
          </div>
        </div>

        {/* 7. View Details CTA */}
        <Link 
          href={`/treks/${trek.slug}`} 
          tabIndex={-1} 
          className={buttonStyleClasses}
          aria-hidden="true"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
