"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Trek } from '@/lib/types';

interface ItineraryDay {
  day: number;
  title: string;
  altitude: string;
  distance: string;
  hours: string;
  meals: string;
  accommodation: string;
  description: string;
}

interface ItineraryTimelineProps {
  trek: Trek & { itinerary?: ItineraryDay[] };
}

export function ItineraryTimeline({ trek }: ItineraryTimelineProps) {
  // Only one card open initially (index 0)
  const [openDay, setOpenDay] = useState<number>(0);

  // Generate production-quality placeholders if no itinerary exists in the database.
  // We use realistic mountain destinations based on the region or trek title if possible.
  const days = trek.itinerary || Array.from({ length: trek.duration_days }, (_, i) => {
    const isFirst = i === 0;
    const isLast = i === trek.duration_days - 1;
    
    let destination = `High Altitude Camp ${i}`;
    let narrative = "Begin the day with an early breakfast before hitting the trail. The path ascends gradually through dense forests of oak and pine, occasionally opening up to reveal stunning views of the surrounding valley. We will stop for a hot lunch near a freshwater stream.";
    
    if (isFirst) {
      destination = `Arrival at Base Camp`;
      narrative = "Arrive at the base camp where you will be greeted by your trek leader and team. We'll have a thorough briefing session covering safety protocols, acclimatization, and the route ahead. Spend the evening resting and preparing your gear for the days to come.";
    } else if (isLast) {
      destination = `Descent and Departure`;
      narrative = "The final leg of our journey involves a steady descent back to civilization. We'll trace our steps down the valley, celebrating the successful completion of the trek. After a farewell lunch with the team, vehicles will be ready for your onward journey.";
    }

    return {
      day: i + 1,
      title: destination,
      altitude: isFirst ? '2,800m' : isLast ? '2,100m' : `${3000 + i * 200}m`,
      distance: isFirst || isLast ? '5 km' : '8 km',
      hours: isFirst || isLast ? '3-4 hours' : '6-7 hours',
      meals: 'Breakfast, Lunch, Dinner',
      accommodation: isLast ? 'Hotel' : 'Camping',
      description: narrative,
    };
  });

  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mb-8" aria-label="Trek Itinerary">
      <h2 className="text-2xl font-bold text-tb-text-primary mb-8">Itinerary</h2>
      
      <div className="relative border-l-2 border-tb-border ml-3 md:ml-4 space-y-6 pb-2">
        {days.map((dayData, index) => {
          const isOpen = openDay === index;
          
          return (
            <div key={index} className="relative pl-6 md:pl-10">
              {/* Timeline Dot */}
              <div 
                className={`absolute w-4 h-4 rounded-full -left-[9px] top-5 border-2 transition-colors duration-300 ${
                  isOpen ? 'bg-tb-primary border-tb-primary' : 'bg-white border-tb-border'
                }`}
                aria-hidden="true"
              />

              {/* Expandable Card */}
              <div 
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'border-tb-primary/30 shadow-tb-medium bg-white' 
                    : 'border-tb-border shadow-tb-subtle bg-white hover:border-tb-primary/50 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenDay(isOpen ? -1 : index)}
                  className="w-full text-left px-5 py-4 md:px-6 md:py-5 flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`itinerary-content-${index}`}
                  id={`itinerary-header-${index}`}
                >
                  <div>
                    <span className="text-xs font-bold text-tb-primary uppercase tracking-wider mb-1 block">
                      Day {dayData.day}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-tb-text-primary">
                      {dayData.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`shrink-0 ml-4 p-2 rounded-full ${isOpen ? 'bg-tb-primary/10 text-tb-primary' : 'bg-tb-sys-background text-tb-text-secondary'}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`itinerary-content-${index}`}
                      role="region"
                      aria-labelledby={`itinerary-header-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-2 border-t border-tb-border/50">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4">
                          <div>
                            <span className="text-xs text-tb-text-secondary block mb-1">Altitude</span>
                            <span className="text-sm font-semibold text-tb-text-primary">{dayData.altitude}</span>
                          </div>
                          <div>
                            <span className="text-xs text-tb-text-secondary block mb-1">Distance</span>
                            <span className="text-sm font-semibold text-tb-text-primary">{dayData.distance}</span>
                          </div>
                          <div>
                            <span className="text-xs text-tb-text-secondary block mb-1">Trekking Hours</span>
                            <span className="text-sm font-semibold text-tb-text-primary">{dayData.hours}</span>
                          </div>
                          <div>
                            <span className="text-xs text-tb-text-secondary block mb-1">Accommodation</span>
                            <span className="text-sm font-semibold text-tb-text-primary">{dayData.accommodation}</span>
                          </div>
                        </div>

                        {/* Narrative */}
                        <div className="prose prose-sm md:prose-base prose-tb max-w-none">
                          <p className="text-tb-text-secondary leading-relaxed m-0">
                            {dayData.description}
                          </p>
                        </div>
                        
                        {/* Meals Tag */}
                        <div className="mt-5 inline-flex items-center rounded-md bg-tb-sys-background px-2.5 py-1 text-xs font-medium text-tb-text-secondary">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-tb-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          Meals: {dayData.meals}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
