import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../layout/Container';

// Real breathtaking imagery for the regions
const REGIONS = [
  {
    name: 'Uttarakhand',
    description: 'The Land of the Gods',
    imageUrl: 'https://images.unsplash.com/photo-1626083515456-e913a52eec89?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'Himachal Pradesh',
    description: 'Valleys of Snow & Pine',
    imageUrl: 'https://images.unsplash.com/photo-1593364947936-2ce9dbd3a3a4?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'Ladakh',
    description: 'The High Altitude Desert',
    imageUrl: 'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&q=80&w=1200',
  },
];

export function FeaturedRegions() {
  return (
    <section id="featured-regions" className="py-24 md:py-32 bg-white">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-tb-text-primary mb-4">
              Explore by Region
            </h2>
            <p className="text-lg text-tb-text-secondary leading-relaxed">
              From the lush meadows of Uttarakhand to the stark, frozen deserts of Ladakh. 
              Discover the diverse landscapes of the Indian Himalayas.
            </p>
          </div>
          <Link 
            href="/search" 
            className="group flex items-center text-tb-primary font-semibold hover:text-tb-primary-hover transition-colors"
          >
            View all regions
            <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REGIONS.map((region) => (
            <Link 
              key={region.name} 
              href={`/search?q=${encodeURIComponent(region.name)}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tb-primary focus-visible:ring-offset-2"
            >
              <Image 
                src={region.imageUrl} 
                alt={`Landscape of ${region.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
              {/* Gradient Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {region.name}
                </h3>
                <p className="text-white/80 font-medium">
                  {region.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
