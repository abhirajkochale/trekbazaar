import React from 'react';
import { Container } from '../layout/Container';

export function TrustMetrics() {
  const metrics = [
    { label: 'Verified Operators', value: '50+' },
    { label: 'Treks Listed', value: '120+' },
    { label: 'States Covered', value: '7' },
    { label: 'Years Experience', value: '15+' },
  ];

  return (
    <section className="bg-white border-b border-tb-border py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-tb-border">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl md:text-5xl font-light text-tb-text-primary tracking-tight mb-2">
                {metric.value}
              </span>
              <span className="text-sm font-medium text-tb-text-tertiary uppercase tracking-widest">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
