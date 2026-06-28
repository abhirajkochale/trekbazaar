import React from 'react';
import { Container } from '@/components/layout/Container';

interface Props {
  activeTreksCount: number;
  totalDepartures: number;
  startingPrice: number | null;
  regionsCovered: number;
  establishedYear: number | null;
}

export function CompanyStats({ activeTreksCount, totalDepartures, startingPrice, regionsCovered, establishedYear }: Props) {
  const stats = [
    {
      label: "Active Treks",
      value: activeTreksCount,
    },
    {
      label: "Upcoming Departures",
      value: totalDepartures,
    },
    {
      label: "Starting Price",
      value: startingPrice ? `₹${startingPrice.toLocaleString('en-IN')}` : '-',
    },
    {
      label: "Regions Covered",
      value: regionsCovered,
    }
  ];

  return (
    <section className="py-12 bg-zinc-50 border-t border-zinc-100">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-zinc-200">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center text-center ${idx === 0 || idx === 2 ? 'border-none md:border-solid' : 'border-none'}`}>
              <span className="text-3xl md:text-4xl font-black text-zinc-900 mb-2">{stat.value}</span>
              <span className="text-sm font-bold tracking-wider text-zinc-500 uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
