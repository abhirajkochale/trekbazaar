import React from 'react';
import { MapPin } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  regionsCovered: string[];
}

export function CompanyRegions({ regionsCovered }: Props) {
  if (!regionsCovered || regionsCovered.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-4">Operating In</h2>
          <p className="text-zinc-500 text-lg mb-12">Discover treks in these incredible regions</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {regionsCovered.map((region, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-2xl text-lg font-bold text-zinc-800 shadow-sm hover:border-tb-primary hover:text-tb-primary transition-colors cursor-default">
                <MapPin className="w-5 h-5 text-tb-primary" /> {region}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
