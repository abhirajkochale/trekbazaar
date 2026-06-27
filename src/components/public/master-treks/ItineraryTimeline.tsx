"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpCircle, Clock, ChevronDown, Utensils, Home } from 'lucide-react';

interface ItineraryDay {
  title: string;
  description: string;
  altitude?: string;
  distance?: string;
  duration?: string;
  meals?: string;
  accommodation?: string;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function ItineraryTimeline({ packages }: Props) {
  // Try to find the first package that actually has a populated itinerary array
  const pkgWithItinerary = packages.find(p => p.itinerary && Array.isArray(p.itinerary) && p.itinerary.length > 0);
  
  if (!pkgWithItinerary) {
    return null; // Return null if NO operator has an itinerary
  }

  const itinerary: ItineraryDay[] = pkgWithItinerary.itinerary;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default to first day open

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden p-6 md:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Itinerary</h2>
          <p className="text-zinc-500 mt-2 text-lg">Day by day schedule (Based on {pkgWithItinerary.companies?.name || 'standard'} package).</p>
        </div>
      </div>

      <div className="relative pl-4 md:pl-8 border-l-2 border-zinc-100 space-y-8">
        {itinerary.map((day, idx) => {
          const isExpanded = expandedDay === idx;
          
          return (
            <div key={idx} className="relative">
              {/* Timeline Dot */}
              <div className={`absolute -left-[21px] md:-left-[37px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors duration-300 ${isExpanded ? 'bg-tb-primary' : 'bg-zinc-300'}`} />
              
              <div 
                className="cursor-pointer group"
                onClick={() => setExpandedDay(isExpanded ? null : idx)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-tb-primary font-bold tracking-wider uppercase text-sm mb-1 block">Day {idx + 1}</span>
                    <h3 className={`text-xl font-bold transition-colors ${isExpanded ? 'text-zinc-900' : 'text-zinc-700 group-hover:text-zinc-900'}`}>
                      {day.title || `Arrival & Briefing`}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                
                <div className="flex flex-wrap gap-4 mt-3">
                  {day.altitude && (
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                      <ArrowUpCircle className="w-4 h-4 text-zinc-400" /> {day.altitude}
                    </div>
                  )}
                  {day.distance && (
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                      <MapPin className="w-4 h-4 text-zinc-400" /> {day.distance}
                    </div>
                  )}
                  {day.duration && (
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                      <Clock className="w-4 h-4 text-zinc-400" /> {day.duration}
                    </div>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2">
                      <p className="text-zinc-600 leading-relaxed text-[15px]">
                        {day.description || 'No description provided for this day.'}
                      </p>
                      
                      {(day.meals || day.accommodation) && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap gap-6">
                          {day.meals && (
                            <div className="flex items-start gap-2">
                              <Utensils className="w-4 h-4 text-emerald-600 mt-0.5" />
                              <div>
                                <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Meals</span>
                                <span className="text-sm font-medium text-zinc-700">{day.meals}</span>
                              </div>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-start gap-2">
                              <Home className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div>
                                <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Stay</span>
                                <span className="text-sm font-medium text-zinc-700">{day.accommodation}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
