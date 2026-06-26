import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { TrekCard } from '@/components/trek/TrekCard';
import type { Trek } from '@/lib/types';

interface FeaturedTreksProps {
  treks: Trek[];
}

export function FeaturedTreks({ treks }: FeaturedTreksProps) {
  // Take top 6 treks for the homepage to prevent cognitive overload
  const topTreks = treks.slice(0, 6);

  return (
    <section id="featured-treks" className="py-24 md:py-32 bg-tb-sys-background border-t border-tb-border">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-tb-text-primary mb-4">
              Curated Expeditions
            </h2>
            <p className="text-lg text-tb-text-secondary leading-relaxed">
              A handpicked selection of our most popular and highly-rated treks. 
              Verified operators, unforgettable experiences.
            </p>
          </div>
          <Link 
            href="/search" 
            className="group flex items-center text-tb-primary font-semibold hover:text-tb-primary-hover transition-colors shrink-0"
          >
            View all {treks.length > 6 ? treks.length : ''} treks
            <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {topTreks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-tb-border bg-white p-16 text-center">
            <p className="text-lg text-tb-text-secondary">
              No treks are currently listed. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {topTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
