"use client";

import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import type { MasterTrekCategory } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

interface Props {
  categories: MasterTrekCategory[];
}

export function QuickFilters({ categories = [] }: Props) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category');

  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-zinc-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative z-40 py-4 md:py-5">
      <Container>
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            
            return (
              <Link 
                key={category.id}
                href={`/search?category=${category.slug}`}
                className={`group whitespace-nowrap px-5 md:px-6 py-2 md:py-2.5 rounded-full border transition-all duration-300 active:scale-95 shrink-0 ${
                  isActive 
                    ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <span className="text-[14px] font-medium transition-colors">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
