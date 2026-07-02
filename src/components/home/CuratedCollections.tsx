"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  {
    title: 'Weekend Escapes',
    subtitle: 'Perfect for quick getaways',
    url: '/search?duration=4',
    image: 'https://images.unsplash.com/photo-1533422902779-babd49fc5981?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'High Altitude Challenges',
    subtitle: 'For the experienced trekker',
    url: '/search?difficulty=Extreme',
    image: 'https://images.unsplash.com/photo-1543346453-294060b299e5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Beginner Friendly',
    subtitle: 'Your first step into the mountains',
    url: '/search?difficulty=Easy',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Snow Expeditions',
    subtitle: 'Experience winter magic',
    url: '/search?season=Winter',
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1200'
  }
];

export function CuratedCollections() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            Discover by Category
          </h2>
          <p className="text-lg text-zinc-500 font-medium">
            Browse aggregated itineraries from dozens of verified operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-[16/9] cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            >
              <Link href={collection.url} className="absolute inset-0 z-20">
                <span className="sr-only">Explore {collection.title}</span>
              </Link>
              
              <div className="absolute inset-0 bg-zinc-800 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              <div className="absolute bottom-0 left-0 p-8 z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                  Curated
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {collection.title}
                </h3>
                <p className="text-base text-white/90 font-medium">
                  {collection.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
