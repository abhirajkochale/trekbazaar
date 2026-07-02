"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { Region } from '@/lib/types';
import { Compass } from 'lucide-react';

interface RegionBentoGridProps {
  regions: Region[];
}

export function RegionBentoGrid({ regions }: RegionBentoGridProps) {
  // Pre-calculated grid layouts based on index
  const getGridClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return 'col-span-1 md:col-span-6 md:row-span-2 h-[400px] md:h-[600px]';
      case 1:
        return 'col-span-1 md:col-span-6 md:row-span-1 h-[300px] md:h-auto';
      case 2:
      case 3:
      default:
        return 'col-span-1 md:col-span-3 md:row-span-1 h-[300px] md:h-auto';
    }
  };

  if (!regions || regions.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Explore by Region
            </h2>
            <p className="text-lg text-zinc-500 font-medium">
              Find and compare treks across the most breathtaking terrains in the Himalayas.
            </p>
          </div>
          <Link 
            href="/regions"
            className="text-base font-bold text-tb-primary hover:text-tb-primary-hover transition-colors flex items-center gap-2"
          >
            View all regions
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-fr gap-4 md:gap-6">
          {regions.map((region, idx) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer bg-zinc-100 ${getGridClass(idx)}`}
            >
              <Link href={`/regions/${region.slug}`} className="absolute inset-0 z-20">
                <span className="sr-only">Explore {region.name}</span>
              </Link>
              
              {region.hero_image_url ? (
                <Image
                  src={region.hero_image_url}
                  alt={region.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                  <Compass className="w-12 h-12 text-zinc-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              <div className="absolute bottom-0 left-0 p-8 z-10 w-full flex items-end justify-between">
                <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                  {region.name}
                </h3>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
