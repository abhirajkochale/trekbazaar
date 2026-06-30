import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import type { Region } from '@/lib/types';

interface RegionHeroProps {
  region: Region;
  trekCount: number;
}

export function RegionHero({ region, trekCount }: RegionHeroProps) {
  const imageUrl = region.hero_image_url || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1920';

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] bg-tb-sys-background flex items-end overflow-hidden">
      <Image
        src={imageUrl}
        alt={`Trekking in ${region.name}`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      <Container className="relative z-10 pb-12 w-full text-white">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-tb-primary text-white">
              {trekCount} Treks Available
            </span>
            {region.best_season && (
              <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {region.best_season}
              </span>
            )}
            {region.altitude_range && (
              <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {region.altitude_range}
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight tracking-tight drop-shadow-sm">
            {region.name}
          </h1>

          <p className="text-xl md:text-2xl text-white/95 max-w-3xl line-clamp-2 md:line-clamp-3 font-medium drop-shadow-sm">
            {region.description || `Discover the best trekking routes in ${region.name}.`}
          </p>
        </div>
      </Container>
    </section>
  );
}
