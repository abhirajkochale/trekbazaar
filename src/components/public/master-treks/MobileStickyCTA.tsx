"use client";

import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function MobileStickyCTA({ packages }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past the hero section (~400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let minPrice = Infinity;
  packages.forEach(pkg => {
    const pkgMinPrice = pkg.departures?.[0]?.offer_price || pkg.departures?.[0]?.base_price || pkg.price_per_person;
    if (pkgMinPrice < minPrice) minPrice = pkgMinPrice;
  });
  if (minPrice === Infinity) minPrice = 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 lg:hidden pb-safe"
        >
          <div className="flex items-center justify-between p-4 px-6 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 font-medium">Starting from</span>
              <span className="text-xl font-bold text-zinc-900 leading-none">{formatPrice(minPrice)}</span>
            </div>
            
            <a 
              href="#operators"
              className="flex-1 max-w-[200px] h-12 flex items-center justify-center bg-tb-primary active:bg-tb-primary-hover text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Compare
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
