"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import type { Trek } from '@/lib/types';
import { ImageLightbox } from '@/components/admin/shared/ImageLightbox';

export function TrekImageGallery({ trek }: { trek: Trek & { gallery?: string[] } }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  let parsedGallery = trek.gallery;
  if (typeof parsedGallery === 'string') {
    try { parsedGallery = JSON.parse(parsedGallery); } catch (e) {}
  }

  let images: string[] = [];
  if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
    images = trek.cover_image_url ? [trek.cover_image_url, ...parsedGallery] : parsedGallery;
  } else if (trek.cover_image_url) {
    images = [trek.cover_image_url];
  }

  // Deduplicate
  images = Array.from(new Set(images));

  if (images.length <= 1) {
    return null; // Don't show the gallery section if there's only 1 image (hero already shows it)
  }

  return (
    <section id="gallery" className="scroll-mt-32 mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-tb-sys-text-primary tracking-tight">Image Gallery</h2>
          <p className="text-tb-sys-text-secondary mt-1">Get a glimpse of the real experience</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
            aria-label={`View image ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                View Full
              </span>
            </div>
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
