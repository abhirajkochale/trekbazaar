import React from 'react';
import Link from 'next/link';

export function RegionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      {/* Illustrated empty state icon */}
      <div className="w-32 h-32 mb-8 relative opacity-80">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-tb-border">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.3C91,-33.5,97.2,-18,97.8,-2.2C98.4,13.6,93.4,29.6,83.9,43.2C74.4,56.8,60.4,68,45.4,75.4C30.4,82.8,14.4,86.4,-1.3,88.7C-17,91,-33,92,-47.1,85.6C-61.2,79.2,-73.4,65.4,-81.8,50.1C-90.2,34.8,-94.8,18,-93.8,1.5C-92.8,-15,-86.2,-31,-77.2,-45C-68.2,-59,-56.8,-71,-43.1,-77.6C-29.4,-84.2,-13.4,-85.4,1.8,-88.6C17,-91.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
        </svg>
        <svg className="absolute inset-0 w-16 h-16 m-auto text-tb-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-tb-text-primary mb-4">
        No Treks Available Yet
      </h2>
      <p className="text-tb-text-secondary max-w-lg mb-8 leading-relaxed">
        We&apos;re currently exploring and mapping out the best trails in this region. 
        In the meantime, check out our other highly-rated Himalayan destinations.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          href="/regions/uttarakhand"
          className="px-6 py-2 rounded-full border border-tb-border bg-white text-tb-text-primary font-medium hover:border-tb-primary hover:text-tb-primary transition-colors"
        >
          Explore Uttarakhand
        </Link>
        <Link 
          href="/regions/himachal-pradesh"
          className="px-6 py-2 rounded-full border border-tb-border bg-white text-tb-text-primary font-medium hover:border-tb-primary hover:text-tb-primary transition-colors"
        >
          Explore Himachal
        </Link>
      </div>
    </div>
  );
}
