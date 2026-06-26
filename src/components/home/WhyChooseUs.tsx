import React from 'react';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';

export function WhyChooseUs() {
  const features = [
    {
      title: 'Verified Operators',
      description: 'We individually verify every trekking company on our platform to ensure safety and quality standards.',
      icon: (
        <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees. Compare prices across multiple operators to find the best value for your expedition.',
      icon: (
        <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Direct Connection',
      description: 'We connect you directly with the operators. Enquire and communicate without intermediaries.',
      icon: (
        <svg className="w-6 h-6 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <Section id="why-choose-us" spacing="lg" background="surface" withBorder>
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-h2 text-tb-text-primary mb-4">Why Book via TrekBazaar?</h2>
          <p className="text-body-lg text-tb-text-secondary max-w-2xl mx-auto">
            We are building the most reliable marketplace for Himalayan treks, putting trekkers first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white border border-tb-border rounded-tb-md shadow-tb-subtle">
              <div className="w-12 h-12 bg-tb-sys-background rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-h3 text-tb-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-tb-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
