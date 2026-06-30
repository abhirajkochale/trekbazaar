"use client";

import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import type { MasterTrekCategory } from '@/lib/types';
import { Mountain, Tent, Snowflake, Activity, Compass, Footprints, Sunrise } from 'lucide-react';

interface Props {
  categories: MasterTrekCategory[];
}

function getCategoryIcon(slug: string) {
  const normalizedSlug = slug.toLowerCase();
  if (normalizedSlug.includes('winter') || normalizedSlug.includes('snow')) return Snowflake;
  if (normalizedSlug.includes('camp') || normalizedSlug.includes('weekend')) return Tent;
  if (normalizedSlug.includes('high-altitude') || normalizedSlug.includes('expedition')) return Mountain;
  if (normalizedSlug.includes('beginner') || normalizedSlug.includes('family') || normalizedSlug.includes('easy')) return Footprints;
  if (normalizedSlug.includes('adventure') || normalizedSlug.includes('extreme')) return Activity;
  if (normalizedSlug.includes('sunrise') || normalizedSlug.includes('morning')) return Sunrise;
  return Compass; // Default
}

export function QuickFilters({ categories = [] }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-zinc-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative z-40 py-4">
      <Container>
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link 
                key={category.id}
                href={`/search?category=${category.slug}`}
                className="group flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm hover:bg-zinc-50 transition-all active:scale-95 shrink-0"
              >
                <Icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                <span className="text-[14px] font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
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
