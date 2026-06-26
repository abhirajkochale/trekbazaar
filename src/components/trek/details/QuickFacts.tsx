import React from 'react';
import { formatDuration, difficultyLabel } from '@/lib/format';
import type { Trek } from '@/lib/types';

interface QuickFactsProps {
  trek: Trek;
}

export function QuickFacts({ trek }: QuickFactsProps) {
  const facts = [
    {
      label: 'Region',
      value: trek.region,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Difficulty',
      value: difficultyLabel(trek.difficulty),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Duration',
      value: formatDuration(trek.duration_days),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Status',
      value: trek.status.charAt(0).toUpperCase() + trek.status.slice(1),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-tb-text-primary mb-6">Quick Facts</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {facts.map((fact, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-tb-text-secondary">
              <div className="bg-tb-sys-background p-2 rounded-md">
                {fact.icon}
              </div>
              <span className="text-sm font-medium">{fact.label}</span>
            </div>
            <span className="text-lg font-semibold text-tb-text-primary pl-11">
              {fact.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
