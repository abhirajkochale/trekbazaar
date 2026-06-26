"use client";

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { TrekCard } from '@/components/trek/TrekCard';
import type { Trek } from '@/lib/types';

interface RelatedTreksProps {
  treks: Trek[];
}

export function RelatedTreks({ treks }: RelatedTreksProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!treks || treks.length === 0) {
    return null;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: shouldReduceMotion ? 0 : 0.1 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  return (
    <section className="mt-16 mb-8 w-full" aria-label="Related Treks">
      <h2 className="text-2xl md:text-3xl font-bold text-tb-text-primary mb-8 border-t border-tb-border pt-12">
        You May Also Like
      </h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {treks.map((trek) => (
          <motion.div 
            key={trek.id} 
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            className="h-full"
          >
            <TrekCard trek={trek} variant="compact" className="h-full" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
