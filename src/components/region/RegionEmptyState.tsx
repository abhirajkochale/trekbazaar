import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

export function RegionEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-32 px-4 bg-white border border-zinc-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full w-full"
    >
      <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100/60 shadow-sm">
        <Map className="w-8 h-8 text-zinc-300" />
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">
        No Treks Available Yet
      </h2>
      <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed font-medium">
        We&apos;re currently exploring and mapping out the best trails in this region. 
        In the meantime, check out our other highly-rated Himalayan destinations.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link 
          href="/regions/uttarakhand"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-zinc-200 bg-white text-zinc-700 font-bold hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-sm text-sm active:scale-95"
        >
          Explore Uttarakhand
        </Link>
        <Link 
          href="/regions/himachal-pradesh"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-zinc-200 bg-white text-zinc-700 font-bold hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-sm text-sm active:scale-95"
        >
          Explore Himachal
        </Link>
      </div>
    </motion.div>
  );
}
