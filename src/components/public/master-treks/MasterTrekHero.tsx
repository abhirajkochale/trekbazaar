import React from 'react';
import Image from 'next/image';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
}

export function MasterTrekHero({ masterTrek }: Props) {
  const imageUrl = masterTrek.cover_image || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=2000';

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-end">
      <Image 
        src={imageUrl} 
        alt={masterTrek.name}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {masterTrek.category?.name && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
              {masterTrek.category.name}
            </span>
          )}
          {masterTrek.region?.name && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
              {masterTrek.region.name}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 shadow-sm">
          {masterTrek.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
          {masterTrek.difficulty && (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${difficultyBadgeClasses(masterTrek.difficulty.toLowerCase())}`}>
                {difficultyLabel(masterTrek.difficulty.toLowerCase())}
              </span>
            </div>
          )}
          
          {(masterTrek.duration_min || masterTrek.duration_max) && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{masterTrek.duration_min === masterTrek.duration_max ? `${masterTrek.duration_min} Days` : `${masterTrek.duration_min}-${masterTrek.duration_max} Days Typical`}</span>
            </div>
          )}

          {masterTrek.altitude && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <span>{masterTrek.altitude}</span>
            </div>
          )}
        </div>
        
        {masterTrek.overview && (
          <p className="mt-6 text-white/80 max-w-3xl leading-relaxed line-clamp-3">
            {masterTrek.overview}
          </p>
        )}
      </div>
    </div>
  );
}
