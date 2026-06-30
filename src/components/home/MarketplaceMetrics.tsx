import React from 'react';
import { Container } from '../layout/Container';
import { ShieldCheck, CalendarDays, MapPin, Users } from 'lucide-react';

interface MarketplaceMetricsProps {
  metrics: {
    totalCompanies: number;
    upcomingDepartures: number;
    statesCovered: number;
    treksAvailable: number;
  }
}

export function MarketplaceMetrics({ metrics }: MarketplaceMetricsProps) {
  const stats = [
    {
      label: "Verified Partners",
      value: metrics.totalCompanies,
      icon: ShieldCheck,
    },
    {
      label: "Upcoming Departures",
      value: metrics.upcomingDepartures,
      icon: CalendarDays,
    },
    {
      label: "Treks Available",
      value: metrics.treksAvailable,
      icon: Users,
    },
    {
      label: "States Covered",
      value: metrics.statesCovered,
      icon: MapPin,
    },
  ];

  return (
    <section className="bg-zinc-50 border-y border-zinc-200 py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-500 flex items-center justify-center mb-4 shadow-sm">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-zinc-900 mb-1">
                {stat.value.toLocaleString()}{stat.value > 10 ? '+' : ''}
              </div>
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
