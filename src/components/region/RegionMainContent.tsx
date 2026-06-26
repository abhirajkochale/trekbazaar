import React from 'react';
import type { Region } from '@/lib/types';
import { RegionBestTimeCalendar } from './RegionBestTimeCalendar';

interface RegionMainContentProps {
  region: Region;
}

export function RegionMainContent({ region }: RegionMainContentProps) {
  return (
    <div className="space-y-8">
      {/* About Section */}
      {region.description && (
        <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-tb-text-primary mb-4">About {region.name}</h2>
          <p className="text-tb-text-secondary leading-relaxed whitespace-pre-line">
            {region.description}
          </p>
        </section>
      )}

      {/* Best Time Calendar (Animated Strip) */}
      <RegionBestTimeCalendar bestSeasonText={region.best_season} />

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Typical Weather */}
        {region.weather && (
          <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-tb-text-primary mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Typical Weather
            </h2>
            <p className="text-tb-text-secondary leading-relaxed">{region.weather}</p>
          </section>
        )}

        {/* Safety Tips */}
        {region.safety_tips && region.safety_tips.length > 0 && (
          <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-tb-text-primary mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Safety Tips
            </h2>
            <ul className="space-y-3">
              {region.safety_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 bg-tb-primary/10 p-1 rounded-full text-tb-primary shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-tb-text-secondary text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Things to Know */}
      {region.things_to_know && region.things_to_know.length > 0 && (
        <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-tb-text-primary mb-4">Things to Know</h2>
          <ul className="space-y-3">
            {region.things_to_know.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-tb-primary font-bold shrink-0 mt-0.5">•</span>
                <span className="text-tb-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {/* Nearby Attractions */}
      {region.nearby_attractions && region.nearby_attractions.length > 0 && (
        <section className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-tb-text-primary mb-4">Nearby Attractions</h2>
          <div className="flex flex-wrap gap-2">
            {region.nearby_attractions.map((attraction, idx) => (
              <span key={idx} className="bg-tb-sys-background border border-tb-border text-tb-text-secondary px-4 py-2 rounded-full text-sm font-medium hover:border-tb-primary hover:text-tb-primary transition-colors cursor-default">
                {attraction}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
