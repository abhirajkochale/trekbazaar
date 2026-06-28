"use client";

import React from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  images: string[];
  companyName: string;
}

export function CompanyGallery({ images, companyName }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-zinc-900 text-white">
      <Container>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
            <Camera className="w-6 h-6 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Photos From Our Adventures</h2>
            <p className="text-zinc-400 mt-1 font-medium">Moments captured by {companyName}</p>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-zinc-800">
              <Image 
                src={img} 
                alt={`${companyName} gallery image ${idx + 1}`}
                width={600}
                height={800} // providing an arbitrary aspect ratio that Next.js Image component uses natively when layout="responsive" isn't strictly enforced in app router. We rely on intrinsic aspect ratio if possible, but for masonry standard width is better.
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
