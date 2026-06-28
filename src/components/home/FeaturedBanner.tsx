"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function FeaturedBanner() {
  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=2400"
          alt="High Altitude Trekking"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient Overlay for Typography */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="inline-block text-white font-bold tracking-widest uppercase text-xs md:text-sm mb-6 border border-white/40 rounded-full px-5 py-2 backdrop-blur-md">
            Featured Collection
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tighter text-white mb-6 leading-[1.05]">
            Winter <br className="hidden md:block"/> Expeditions.
          </h2>
          <p className="text-xl md:text-3xl text-white/90 font-medium max-w-2xl mb-10 leading-snug drop-shadow-md">
            Experience the raw beauty of the Himalayas under snow. Handpicked high-altitude challenges.
          </p>
          <Link 
            href="/search?season=Winter"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-zinc-900 text-lg font-bold rounded-full hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Explore Winter Treks
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
