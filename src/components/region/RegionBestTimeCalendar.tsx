"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

const ALL_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface RegionBestTimeCalendarProps {
  bestSeasonText: string | null;
}

export function RegionBestTimeCalendar({ bestSeasonText }: RegionBestTimeCalendarProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!bestSeasonText) return null;

  // Simple heuristic to extract mentioned months from the text string
  // e.g. "May to June, Sep to Nov" -> ['May', 'Jun', 'Sep', 'Oct', 'Nov']
  // This is a naive parsing meant for display purposes based on typical data format.
  const textLower = bestSeasonText.toLowerCase();
  
  // We'll mark active if the month name is explicitly mentioned, or if it falls in a "X to Y" range.
  // Given "X to Y", we can parse ranges.
  const activeMonths = new Set<string>();
  
  const parseRanges = (text: string) => {
    // Check for explicit month names
    ALL_MONTHS.forEach((m, idx) => {
      if (text.includes(m.toLowerCase()) || text.includes(new Date(2000, idx, 1).toLocaleString('default', { month: 'long' }).toLowerCase())) {
        activeMonths.add(m);
      }
    });

    // Attempt to parse "to" or "-" ranges
    const ranges = text.split(/,|and/);
    ranges.forEach(range => {
      if (range.includes(' to ') || range.includes('-')) {
        const parts = range.split(/ to |-/).map(p => p.trim().substring(0, 3).toLowerCase());
        const startIdx = ALL_MONTHS.findIndex(m => m.toLowerCase() === parts[0]);
        const endIdx = ALL_MONTHS.findIndex(m => m.toLowerCase() === parts[1]);
        
        if (startIdx !== -1 && endIdx !== -1) {
          if (startIdx <= endIdx) {
            for (let i = startIdx; i <= endIdx; i++) activeMonths.add(ALL_MONTHS[i]);
          } else {
            // crosses year boundary e.g. Nov to Feb
            for (let i = startIdx; i < 12; i++) activeMonths.add(ALL_MONTHS[i]);
            for (let i = 0; i <= endIdx; i++) activeMonths.add(ALL_MONTHS[i]);
          }
        }
      }
    });
  };

  parseRanges(textLower);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.03 } as const
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const } }
  };

  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mt-8">
      <h2 className="text-xl font-bold text-tb-text-primary mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Best Time to Visit
      </h2>
      <p className="text-tb-text-secondary mb-6 text-sm">
        {bestSeasonText}
      </p>

      <motion.div 
        className="grid grid-cols-6 md:grid-cols-12 gap-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {ALL_MONTHS.map((month) => {
          const isActive = activeMonths.has(month);
          return (
            <motion.div
              key={month}
              variants={itemVariants}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                isActive 
                  ? 'bg-tb-primary text-white border-tb-primary shadow-sm' 
                  : 'bg-tb-sys-background text-tb-text-tertiary border-tb-border opacity-60'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
