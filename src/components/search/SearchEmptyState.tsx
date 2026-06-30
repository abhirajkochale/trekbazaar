"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export function SearchEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white border border-zinc-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full"
    >
      <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100/60 shadow-sm">
        <SearchX className="w-4 h-4 text-zinc-300" />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">No exact matches</h3>
      <p className="text-base text-zinc-500 mb-8 max-w-sm font-medium leading-relaxed">
        We couldn&apos;t find any treks matching those specific filters. Try broadening your dates or adjusting your preferences.
      </p>
      <Link 
        href="/search" 
        className="inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-full active:scale-95 bg-zinc-900 text-white hover:bg-black shadow-md h-12 px-8 text-sm"
      >
        Clear all filters
      </Link>
    </motion.div>
  );
}
