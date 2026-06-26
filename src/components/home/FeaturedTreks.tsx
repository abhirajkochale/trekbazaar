import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { TrekBrowser } from '../TrekBrowser';
import type { Trek } from '@/lib/types';

interface FeaturedTreksProps {
  treks: Trek[];
  regions: string[];
}

export function FeaturedTreks({ treks, regions }: FeaturedTreksProps) {
  return (
    <Section id="featured-treks" spacing="lg" background="muted" withBorder>
      <Container>
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-h2 text-tb-text-primary mb-2">Available Treks</h2>
          <p className="text-body text-tb-text-secondary">
            Browse our curated catalog of upcoming expeditions.
          </p>
        </div>

        {treks.length === 0 ? (
          <div className="rounded-tb-md border border-dashed border-tb-border bg-white p-10 text-center">
            <p className="text-tb-text-secondary">
              No treks are listed yet. Please check back soon.
            </p>
          </div>
        ) : (
          <TrekBrowser treks={treks} regions={regions} />
        )}
      </Container>
    </Section>
  );
}
