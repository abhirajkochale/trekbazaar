"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';

interface RegionFeaturedTreksProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
}

export function RegionFeaturedTreks({ treks }: RegionFeaturedTreksProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!treks || treks.length === 0) return null;

  // We sort by highest price as requested (or newest if price is tied)
  const featuredTreks = [...treks]
    .sort((a, b) => (b.aggregated?.lowestPrice || 0) - (a.aggregated?.lowestPrice || 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
    <section className="mt-12 mb-16 relative z-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">
            Top Rated Destinations
          </h2>
          <p className="text-zinc-500 mt-1">Highest rated and most booked adventures in this region.</p>
        </div>
      </div>
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
            className="h-full"
          >
            <div className="relative group shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden ring-1 ring-zinc-200 bg-white">
              <div className="absolute top-4 left-4 z-20 bg-tb-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                Featured
              </div>
              <MasterTrekSearchCard masterTrek={trek} className="border-0 shadow-none ring-0" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
