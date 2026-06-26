import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { formatPrice, formatDuration, difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import type { Trek } from '@/lib/types';

interface HeroGalleryProps {
  trek: Trek;
}

export function HeroGallery({ trek }: HeroGalleryProps) {
  const imageUrl = trek.cover_image_url || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1920';

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] max-h-[800px] bg-tb-sys-background flex items-end overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={`Cover image of ${trek.title}`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      <Container className="relative z-10 pb-12 w-full text-white">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${difficultyBadgeClasses(trek.difficulty)}`}>
              {difficultyLabel(trek.difficulty)}
            </span>
            <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trek.region}
            </span>
            <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(trek.duration_days)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
            {trek.title}
          </h1>

          <div className="flex items-end gap-2 text-white/90">
            <span className="text-sm md:text-base opacity-80 mb-1">Starting from</span>
            <span className="text-2xl md:text-3xl font-bold text-white">{formatPrice(trek.price_per_person)}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
