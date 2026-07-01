import React from 'react';
import type { Trek } from '@/lib/types';

interface HighlightsProps {
  trek: Trek;
}

export function Highlights({ trek }: HighlightsProps) {
  let parsedHighlights = trek.highlights;
  if (typeof parsedHighlights === 'string') {
    try { parsedHighlights = JSON.parse(parsedHighlights); } catch (e) {}
  }

  const highlights = Array.isArray(parsedHighlights) ? parsedHighlights : [];

  if (highlights.length === 0) {
    return null; // Don't show the section if there are no highlights
  }

  return (
    <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-tb-text-primary mb-6">Highlights</h2>
      
      <ul className="space-y-4">
        {highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 bg-tb-primary/10 p-1 rounded-full text-tb-primary shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-tb-text-secondary leading-relaxed">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
