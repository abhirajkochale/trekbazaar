import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';

export function TrustMetrics() {
  const metrics = [
    { label: 'Verified Operators', value: '50+' },
    { label: 'Treks Listed', value: '120+' },
    { label: 'States Covered', value: '7' },
    { label: 'Years Experience', value: '15+' },
  ];

  return (
    <Section spacing="sm" background="surface" className="border-b border-tb-border py-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-tb-primary mb-1">{metric.value}</span>
              <span className="text-xs md:text-sm font-medium text-tb-text-secondary uppercase tracking-wider">{metric.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
