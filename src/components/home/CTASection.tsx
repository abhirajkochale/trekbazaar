import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export function CTASection() {
  return (
    <Section spacing="lg" background="muted" withBorder>
      <Container variant="reading" className="text-center">
        <h2 className="text-h2 text-tb-text-primary mb-4">
          Ready for the Mountains?
        </h2>
        <p className="text-body-lg text-tb-text-secondary mb-8">
          Stop planning and start doing. Browse our comprehensive catalog of verified treks and find your next adventure today.
        </p>
        <Link href="#featured-treks">
          <Button size="lg" variant="primary">
            Explore All Treks
          </Button>
        </Link>
      </Container>
    </Section>
  );
}
