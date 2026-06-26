"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { TrekCard } from '@/components/trek/TrekCard';
import type { Trek } from '@/lib/types';

interface RegionFeaturedTreksProps {
  treks: Trek[];
}

export function RegionFeaturedTreks({ treks }: RegionFeaturedTreksProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!treks || treks.length === 0) return null;

  // We sort by highest price as requested (or newest if price is tied)
  const featuredTreks = [...treks]
    .sort((a, b) => b.price_per_person - a.price_per_person || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="mt-4 mb-16 relative z-20 -top-8 md:-top-12">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {featuredTreks.map((trek, index) => (
          <motion.div 
            key={trek.id} 
            variants={itemVariants} 
            className={`h-full ${index === 0 ? 'md:-mt-4' : ''}`}
          >
            {/* We render it slightly larger by wrapping it in a scaling div, 
                or passing a variant if TrekCard supports it. Since we reuse TrekCard, 
                we can use CSS transforms or just rely on the layout. */}
            <div className="relative group h-full shadow-lg rounded-2xl overflow-hidden ring-1 ring-tb-border bg-white">
              <div className="absolute top-4 left-4 z-20 bg-tb-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Featured
              </div>
              <TrekCard trek={trek} className="h-full border-0 shadow-none ring-0" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
