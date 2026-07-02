import React from 'react';
import Image from 'next/image';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function MasterTrekHero({ masterTrek, packages }: Props) {
  const imageUrl = masterTrek.cover_image;

  const companiesCount = new Set(packages.map(p => p.companies?.id)).size;
  const departuresCount = packages.reduce((acc, p) => acc + (p.departures?.length || 0), 0);

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-end">
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={masterTrek.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" />
      )}
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

          {masterTrek.best_season && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <span>{masterTrek.best_season}</span>
            </div>
          )}
        </div>
        
        {masterTrek.overview && (
          <p className="mt-6 text-white/80 max-w-3xl leading-relaxed text-lg line-clamp-3">
            {masterTrek.overview}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <span className="block text-xs text-white/70 uppercase tracking-wider font-semibold">Trekking Agencies</span>
            <span className="text-xl font-bold text-white">{companiesCount} Verified</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <span className="block text-xs text-white/70 uppercase tracking-wider font-semibold">Upcoming Departures</span>
            <span className="text-xl font-bold text-white">{departuresCount} Dates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
