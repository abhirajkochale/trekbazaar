"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { HeroOmnibox } from './HeroOmnibox';

export function HeroSection() {

  return (
    <section className="relative z-[45] w-full min-h-[65vh] md:min-h-[90vh] flex items-center justify-center bg-black">
      {/* Background Image Wrapper to prevent scrollbars while allowing dropdown to overflow section */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image 
            src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2400"
            alt="Snowy Himalayan Peak"
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
        </motion.div>
      </div>
      
      {/* Gradient Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-0 pointer-events-none" />

      {/* Content */}
      <Container className="relative z-10 w-full pt-32 pb-20 flex flex-col items-center">


        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center w-full max-w-4xl px-4 md:px-0"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
            India's marketplace for <br className="hidden md:block" />
            <span className="text-white/90">trekking companies.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Compare itineraries, verified operators, and prices in one place.
          </p>

          {/* Airbnb-style Omnibox */}
          <HeroOmnibox />
        </motion.div>
      </Container>
    </section>
  );
}
