"use client";

import React from 'react';
import { formatPrice } from '@/lib/format';
import { CalendarDays, MapPin, Mountain, Clock } from 'lucide-react';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allDepartures: any[];
}

export function StickySidebar({ masterTrek, packages, allDepartures }: Props) {
  let minPrice = Infinity;
  packages.forEach(pkg => {
    const pkgMinPrice = pkg.departures?.[0]?.offer_price || pkg.departures?.[0]?.base_price || pkg.price_per_person;
    if (pkgMinPrice < minPrice) minPrice = pkgMinPrice;
  });
  if (minPrice === Infinity) minPrice = 0;

  const companiesCount = new Set(packages.map(p => p.companies?.id)).size;
  const nextDeparture = allDepartures.length > 0 ? allDepartures[0] : null;

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
      {/* Price Header */}
      <div className="flex items-end justify-between mb-6 pb-6 border-b border-zinc-100">
        <div>
          <span className="text-zinc-500 font-medium text-sm block mb-1">Starting from</span>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-zinc-900 tracking-tight">{formatPrice(minPrice)}</span>
          </div>
        </div>
        {companiesCount > 0 && (
          <div className="text-right">
            <span className="text-tb-primary font-bold text-lg">{companiesCount}</span>
            <span className="text-zinc-500 text-xs block font-medium">Operators</span>
          </div>
        )}
      </div>

      {/* Quick Info Grid */}
      <div className="space-y-4 mb-8">
        {nextDeparture && (
          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-sm font-bold text-zinc-900">Next Departure</span>
              <span className="block text-sm text-zinc-600 font-medium">
                {new Date(nextDeparture.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {(masterTrek.duration_min || masterTrek.duration_max) && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-sm font-bold text-zinc-900">Duration</span>
              <span className="block text-sm text-zinc-600 font-medium">
                {masterTrek.duration_min === masterTrek.duration_max ? `${masterTrek.duration_min} Days` : `${masterTrek.duration_min}-${masterTrek.duration_max} Days`}
              </span>
            </div>
          </div>
        )}

        {masterTrek.difficulty && (
          <div className="flex items-start gap-3">
            <Mountain className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-sm font-bold text-zinc-900">Difficulty</span>
              <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-bold uppercase tracking-wider ${difficultyBadgeClasses(masterTrek.difficulty)}`}>
                {difficultyLabel(masterTrek.difficulty)}
              </span>
            </div>
          </div>
        )}

        {masterTrek.region?.name && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-sm font-bold text-zinc-900">Region</span>
              <span className="block text-sm text-zinc-600 font-medium">{masterTrek.region.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <a 
          href="#operators"
          className="w-full h-12 flex items-center justify-center bg-tb-primary hover:bg-tb-primary-hover text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-md"
        >
          Compare Operators
        </a>
        <button 
          type="button"
          className="w-full h-12 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-all"
        >
          Save to Wishlist
        </button>
      </div>

      <p className="text-center text-xs text-zinc-500 font-medium mt-4">
        Best Price Guarantee • No Booking Fees
      </p>
    </div>
  );
}
