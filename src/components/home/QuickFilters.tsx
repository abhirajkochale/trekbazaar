"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';

const QUICK_FILTERS = [
  { name: '🔥 Popular', url: '/search?sort=most-companies' },
  { name: '💰 Budget', url: '/search?maxPrice=12000' },
  { name: '🏕️ Weekend', url: '/search?duration=4' },
  { name: '🧗 Beginner', url: '/search?difficulty=Easy' },
  { name: '❄️ Winter', url: '/search?season=Winter' },
  { name: '🏔️ High Altitude', url: '/search?difficulty=Difficult' },
];

export function QuickFilters() {
  return (
    <div className="bg-white border-b border-zinc-100 py-4 shadow-sm relative z-40">
      <Container>
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1">
          {QUICK_FILTERS.map((filter, i) => (
            <motion.div
              key={filter.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link 
                href={filter.url}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-zinc-200 text-sm font-semibold text-zinc-700 bg-zinc-50 hover:bg-white hover:border-tb-primary hover:text-tb-primary hover:shadow-sm transition-all active:scale-95 block"
              >
                {filter.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
