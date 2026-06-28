import React from 'react';
import { Clock, MapPin, Mountain, ArrowUpCircle, Navigation } from 'lucide-react';
import { difficultyLabel } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
}

export function QuickFacts({ masterTrek }: Props) {
  const facts = [];

  if (masterTrek.difficulty) {
    facts.push({
      icon: Mountain,
      label: 'Difficulty',
      value: difficultyLabel(masterTrek.difficulty),
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    });
  }

  if (masterTrek.duration_min || masterTrek.duration_max) {
    const dur = masterTrek.duration_min === masterTrek.duration_max 
      ? `${masterTrek.duration_min} Days` 
      : `${masterTrek.duration_min}-${masterTrek.duration_max} Days`;
    facts.push({
      icon: Clock,
      label: 'Duration',
      value: dur,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    });
  }

  if (masterTrek.altitude) {
    facts.push({
      icon: ArrowUpCircle,
      label: 'Max Altitude',
      value: masterTrek.altitude,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    });
  }

  if (masterTrek.best_season) {
    facts.push({
      icon: Navigation,
      label: 'Best Season',
      value: masterTrek.best_season,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    });
  }

  if (masterTrek.region?.name) {
    facts.push({
      icon: MapPin,
      label: 'Region',
      value: masterTrek.region.name,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {facts.map((fact, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-start gap-4 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${fact.bg}`}>
            <fact.icon className={`w-5 h-5 ${fact.color}`} />
          </div>
          <div>
            <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{fact.label}</span>
            <span className="block text-sm font-bold text-zinc-900 leading-tight">{fact.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
