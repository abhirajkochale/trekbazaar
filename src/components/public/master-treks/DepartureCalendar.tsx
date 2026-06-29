"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, ShieldCheck, Clock } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/format';
import Link from 'next/link';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allDepartures: any[];
}

export function DepartureCalendar({ allDepartures }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (allDepartures.length > 0) {
      return new Date(allDepartures[0].departure_date);
    }
    return new Date();
  });

  // Group departures by Year-Month
  const departuresByMonth = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<string, any[]>();
    allDepartures.forEach(d => {
      const date = new Date(d.departure_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });
    return map;
  }, [allDepartures]);

  if (allDepartures.length === 0) {
    return null; // Don't render section if no departures exist
  }

  const currentKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
  const currentDepartures = departuresByMonth.get(currentKey) || [];

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Departure Calendar</h2>
          <p className="text-zinc-500 mt-2 text-lg">Compare available dates across all operators.</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Available
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
            <span className="w-3 h-3 rounded-full bg-amber-500" /> Fast Filling
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 p-4 border-b border-zinc-100 flex items-center justify-between">
        <button 
          onClick={handlePrevMonth}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-6 h-6 text-zinc-700" />
        </button>
        <span className="text-xl font-bold text-zinc-900 tracking-wide">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={handleNextMonth}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors shadow-sm"
        >
          <ChevronRight className="w-6 h-6 text-zinc-700" />
        </button>
      </div>

      <div className="p-6 md:p-8">
        {currentDepartures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 font-medium text-lg">No departures scheduled for this month.</p>
            <button 
              onClick={handleNextMonth}
              className="mt-4 text-tb-primary font-bold hover:underline"
            >
              Check next month
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDepartures.map(d => {
              const availableSeats = d.total_seats - d.booked_seats;
              const fillPercentage = d.booked_seats / d.total_seats;
              const statusColor = fillPercentage > 0.8 ? 'bg-amber-500' : 'bg-emerald-500';
              const price = d.offer_price || d.base_price;
              
              return (
                <div key={d.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-tb-primary hover:shadow-md transition-all group gap-4">
                  
                  {/* Left: Date & Operator */}
                  <div className="flex items-center gap-6 w-full md:w-auto flex-1">
                    <div className="bg-zinc-50 p-3 rounded-xl min-w-[80px] text-center border border-zinc-200/60">
                      <span className="block text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        {new Date(d.departure_date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="block text-2xl font-black text-zinc-900">
                        {new Date(d.departure_date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-zinc-900 text-lg">{d.company?.name}</span>
                        {d.company?.verification_status === 'approved' && (
                          <ShieldCheck className="w-4 h-4 text-tb-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {formatDuration(d.duration_days)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {availableSeats} seats left</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Price & CTA */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pl-0 md:pl-6 md:border-l border-zinc-100 pt-4 md:pt-0 border-t md:border-t-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-zinc-900">{formatPrice(price)}</span>
                        {d.offer_price && d.offer_price < d.base_price && (
                          <span className="text-xs font-bold text-red-500 line-through">{formatPrice(d.base_price)}</span>
                        )}
                      </div>
                    </div>
                    
                    <Link
                      href={`/checkout/${d.id}`}
                      className="h-12 px-6 rounded-xl bg-zinc-900 hover:bg-tb-primary text-white font-bold flex items-center justify-center transition-colors shrink-0"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
