import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';

// Temporary dummy data for Version 1
const REGIONS = [
  {
    name: 'Uttarakhand',
    description: 'Home to the Valley of Flowers and Roopkund.',
    imageUrl: 'https://images.unsplash.com/photo-1626083515456-e913a52eec89?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Himachal Pradesh',
    description: 'Explore the vast landscapes of Spiti and Manali.',
    imageUrl: 'https://images.unsplash.com/photo-1593364947936-2ce9dbd3a3a4?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Ladakh',
    description: 'The land of high passes and stark mountain deserts.',
    imageUrl: 'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&q=80&w=800',
  },
];

export function FeaturedRegions() {
  return (
    <Section id="featured-regions" spacing="lg" background="surface" withBorder>
      <Container>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-h2 text-tb-text-primary mb-2">Explore by Region</h2>
          <p className="text-body text-tb-text-secondary">
            Discover the diverse landscapes of the Indian Himalayas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REGIONS.map((region) => (
            <Link 
              key={region.name} 
              href={`/search?q=${encodeURIComponent(region.name)}`}
              className="group block relative overflow-hidden rounded-tb-md border border-tb-border bg-white shadow-tb-subtle hover:shadow-tb-medium transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden bg-tb-sys-background relative">
                <Image 
                  src={region.imageUrl} 
                  alt={region.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-tb-slow ease-tb-ease group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white border-t border-tb-border">
                <h3 className="text-h3 text-tb-text-primary mb-1">{region.name}</h3>
                <p className="text-sm text-tb-text-secondary">{region.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
