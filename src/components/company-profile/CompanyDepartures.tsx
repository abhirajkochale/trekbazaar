"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { Calendar, Users, ArrowRight, Clock } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departures: any[];
  companySlug: string;
}

export function CompanyDepartures({ departures, companySlug }: Props) {
  const [limit, setLimit] = useState(8);
  
  if (!departures || departures.length === 0) return null;

  const visibleDepartures = departures.slice(0, limit);

  return (
    <section className="py-16 bg-white border-b border-zinc-100">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Upcoming Departures</h2>
            <p className="text-zinc-500 text-lg">Browse {departures.length} scheduled group departures chronologically.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleDepartures.map(dep => {
            const availableSeats = dep.total_seats - dep.booked_seats;
            const dateObj = new Date(dep.departure_date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
            
            return (
              <div key={dep.id} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 hover:border-tb-primary hover:shadow-md transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                      <Calendar className="w-4 h-4 text-tb-primary" /> {dateStr}
                    </div>
                    {availableSeats <= 5 && (
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                        {availableSeats} left
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-zinc-900 line-clamp-2 mb-2 group-hover:text-tb-primary transition-colors">
                    {dep.treks?.title || dep.treks?.master_trek?.name || 'Trek Package'}
                  </h3>
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Price per person</div>
                    <div className="text-lg font-black text-zinc-900">{formatPrice(dep.offer_price || dep.base_price)}</div>
                  </div>
                  <Link 
                    href={`/company/${companySlug}/${dep.treks?.slug}`}
                    className="w-10 h-10 bg-white border border-zinc-200 group-hover:bg-tb-primary group-hover:border-tb-primary group-hover:text-white text-zinc-400 rounded-full flex items-center justify-center transition-all"
                    aria-label="Book Departure"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {departures.length > limit && (
          <div className="mt-10 text-center">
            <button 
              onClick={() => setLimit(prev => prev + 12)}
              className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Clock className="w-4 h-4" /> Load More Departures
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
