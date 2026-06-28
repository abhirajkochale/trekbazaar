"use client";

import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { Calendar, Users, ArrowRight, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departures: any[];
  companySlug: string;
}

export function CompanyUpcomingWeekend({ departures, companySlug }: Props) {
  if (!departures || departures.length === 0) return null;

  return (
    <section className="py-12 bg-zinc-50 border-b border-zinc-100">
      <Container>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Upcoming This Weekend ⭐</h2>
            <p className="text-zinc-500 text-sm font-medium">Last minute spots for the upcoming weekend</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departures.map(dep => {
            const availableSeats = dep.total_seats - dep.booked_seats;
            const dateObj = new Date(dep.departure_date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
            
            return (
              <div key={dep.id} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {availableSeats <= 5 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                    Only {availableSeats} left!
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-zinc-900 line-clamp-1 mb-2 group-hover:text-tb-primary transition-colors">
                  {dep.treks?.title || dep.treks?.master_trek?.name || 'Trek Package'}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium mb-1">
                  <Calendar className="w-4 h-4 text-zinc-400" /> {dateStr}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium mb-4">
                  <Users className="w-4 h-4 text-zinc-400" /> {availableSeats} Seats Available
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Price</div>
                    <div className="text-xl font-black text-zinc-900">{formatPrice(dep.offer_price || dep.base_price)}</div>
                  </div>
                  <Link 
                    href={`/company/${companySlug}/${dep.treks?.slug}`}
                    className="bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-transform active:scale-95"
                  >
                    Book <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
