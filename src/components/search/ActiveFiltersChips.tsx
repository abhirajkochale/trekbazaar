"use client";

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ActiveFiltersChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const activeParams = Array.from(searchParams.entries()).filter(([key]) => 
    key !== 'sort' && key !== 'page' && key !== 'q'
  );
  
  const q = searchParams.get('q');

  if (activeParams.length === 0 && !q) return null;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page'); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <AnimatePresence>
        {q && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-sm"
          >
            Search: {q}
            <button onClick={() => removeFilter('q')} className="hover:bg-zinc-700 rounded-full p-0.5 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
        
        {activeParams.map(([key, value]) => {
          let displayLabel = value;
          if (key === 'minPrice') displayLabel = `Min ₹${value}`;
          if (key === 'maxPrice') displayLabel = `Max ₹${value}`;
          if (key === 'duration') displayLabel = `Up to ${value} days`;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-tb-primary/20 text-tb-primary text-xs font-semibold shadow-sm"
            >
              {displayLabel}
              <button onClick={() => removeFilter(key)} className="hover:bg-tb-primary/10 rounded-full p-0.5 transition-colors text-tb-primary/70 hover:text-tb-primary">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {(activeParams.length > 0 || q) && (
        <button onClick={clearAll} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 ml-2 underline decoration-zinc-300 underline-offset-2">
          Clear all
        </button>
      )}
    </div>
  );
}
