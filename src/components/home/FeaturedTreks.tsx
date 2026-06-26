import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { TrekCard } from '@/components/TrekCard';
import { Button } from '../ui/Button';
import type { Trek } from '@/lib/types';

interface FeaturedTreksProps {
  treks: Trek[];
}

export function FeaturedTreks({ treks }: FeaturedTreksProps) {
  // Take top 6 treks for the homepage to prevent cognitive overload
  const topTreks = treks.slice(0, 6);

  return (
    <Section id="featured-treks" spacing="lg" background="muted" withBorder>
      <Container>
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-h2 text-tb-text-primary mb-2">Featured Treks</h2>
            <p className="text-body text-tb-text-secondary">
              A handpicked selection of our most popular expeditions.
            </p>
          </div>
          <Link href="/search" className="shrink-0">
            <Button variant="outline">View All Treks</Button>
          </Link>
        </div>

        {topTreks.length === 0 ? (
          <div className="rounded-tb-md border border-dashed border-tb-border bg-white p-10 text-center">
            <p className="text-tb-text-secondary">
              No treks are listed yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTreks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
