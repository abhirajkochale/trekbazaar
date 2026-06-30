"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';
import { SearchHeader } from '@/components/search/SearchHeader';

interface RegionTreksGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
  totalCount: number;
}

export function RegionTreksGrid({ treks, totalCount }: RegionTreksGridProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: shouldReduceMotion ? 0 : 0.05 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section id="treks" className="mt-16 w-full scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-tb-text-primary mb-2 border-t border-tb-border pt-12">
          Explore Treks
        </h2>
        <p className="text-tb-text-secondary">
          Find your perfect adventure in this region.
        </p>
      </div>

      {/* Reuse SearchHeader for text search and sorting */}
      <div className="mb-8 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden border border-transparent sm:border-tb-border relative z-30">
        <SearchHeader totalCount={totalCount} />
      </div>

      {treks.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {treks.map((trek) => (
            <motion.div key={trek.id} variants={itemVariants} className="h-full">
              <MasterTrekSearchCard masterTrek={trek} className="h-full" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-tb-border shadow-sm">
          <svg className="w-12 h-12 text-tb-text-tertiary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-tb-text-primary mb-2">No treks found</h3>
          <p className="text-tb-text-secondary max-w-md mx-auto">
            We couldn&apos;t find any treks matching your search in this region. Try adjusting your search or sort criteria.
          </p>
        </div>
      )}
    </section>
  );
}
