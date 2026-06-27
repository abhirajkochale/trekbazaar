"use client";

import React, { useMemo } from 'react';
import { Building2, CalendarDays, Star, Clock, IndianRupee } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function MarketplaceSummaryBar({ packages }: Props) {
  const summary = useMemo(() => {
    const companies = new Set(packages.map(p => p.companies?.id)).size;
    let minPrice = Infinity;
    let totalDepartures = 0;
    let totalDuration = 0;

    packages.forEach(pkg => {
      if (pkg.price_per_person < minPrice) minPrice = pkg.price_per_person;
      if (pkg.duration_days) totalDuration += pkg.duration_days;
      if (pkg.departures) totalDepartures += pkg.departures.length;
    });

    return {
      companies,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      totalDepartures,
      avgDuration: packages.length ? Math.round(totalDuration / packages.length) : 0,
      avgRating: "4.8" // Placeholder
    };
  }, [packages]);

  return (
    <div className="w-full bg-white border-b border-zinc-200 sticky top-[64px] z-40 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-hide snap-x">
          
          <div className="flex items-center gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Operators</p>
              <p className="text-sm font-bold text-zinc-900">{summary.companies} Available</p>
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-200 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Lowest Price</p>
              <p className="text-sm font-bold text-zinc-900">{formatPrice(summary.minPrice)}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-200 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Departures</p>
              <p className="text-sm font-bold text-zinc-900">{summary.totalDepartures} Upcoming</p>
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-200 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Avg Rating</p>
              <p className="text-sm font-bold text-zinc-900">{summary.avgRating} / 5</p>
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-200 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Avg Duration</p>
              <p className="text-sm font-bold text-zinc-900">{formatDuration(summary.avgDuration)}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
