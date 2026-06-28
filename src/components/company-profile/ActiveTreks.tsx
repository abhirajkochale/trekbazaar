import React from 'react';
import { Container } from '@/components/layout/Container';
import { TrekGridSection } from '@/components/home/TrekGridSection';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
}

export function ActiveTreks({ treks }: Props) {
  if (!treks || treks.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-50 border-t border-zinc-100">
      <Container>
        <div className="-mt-16">
          <TrekGridSection 
            title="Active Treks" 
            subtitle="Browse all itineraries currently operated by this company." 
            treks={treks} 
          />
        </div>
      </Container>
    </section>
  );
}
