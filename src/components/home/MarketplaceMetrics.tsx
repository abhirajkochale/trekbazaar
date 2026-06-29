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
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Upcoming Departures",
      value: metrics.upcomingDepartures,
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Treks Available",
      value: metrics.treksAvailable,
      icon: Users,
      color: "text-tb-primary",
      bg: "bg-orange-50",
    },
    {
      label: "States Covered",
      value: metrics.statesCovered,
      icon: MapPin,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="bg-zinc-50 border-y border-zinc-200 py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
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
