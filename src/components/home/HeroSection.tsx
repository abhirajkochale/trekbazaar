"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { HeroOmnibox } from './HeroOmnibox';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<'search' | 'experiences'>('search');

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
        
        {/* Toggle (Stays vs Experiences style) */}
        <div className="flex items-center gap-6 mb-8 text-white/90 font-medium">
          <button 
            onClick={() => setActiveTab('search')}
            className={`pb-2 border-b-2 transition-colors ${activeTab === 'search' ? 'border-white text-white' : 'border-transparent hover:text-white hover:border-white/50'}`}
          >
            Find a Trek
          </button>
          <button 
            onClick={() => setActiveTab('experiences')}
            className={`pb-2 border-b-2 transition-colors ${activeTab === 'experiences' ? 'border-white text-white' : 'border-transparent hover:text-white hover:border-white/50'}`}
          >
            Custom Groups
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center w-full max-w-4xl px-4 md:px-0"
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-4 md:mb-6 drop-shadow-lg">
            Find your next <br className="hidden md:block" />
            <span className="text-white/90">Himalayan adventure.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-base md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Compare verified operators, find the best prices, and book your departure in minutes.
          </p>

          {/* Airbnb-style Omnibox */}
          <HeroOmnibox />

          {/* Quick Links / Filter Chips */}
          <div className="mt-8 flex overflow-x-auto snap-x hide-scrollbar whitespace-nowrap items-center justify-start md:justify-center gap-3 text-sm font-medium text-white/80 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 md:w-auto">
            <span className="opacity-70 uppercase tracking-widest text-xs mr-2 shrink-0 snap-start">Quick Filters</span>
            <Link href="/search?difficulty=Easy" className="shrink-0 snap-start bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-all active:scale-95">Easy</Link>
            <Link href="/search?season=Winter" className="shrink-0 snap-start bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-all active:scale-95">Winter</Link>
            <Link href="/search?maxPrice=10000" className="shrink-0 snap-start bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-all active:scale-95">Under ₹10000</Link>
            <Link href="/search?category=weekend-treks" className="shrink-0 snap-start bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-all active:scale-95">Weekend</Link>
            <Link href="/search?category=high-altitude" className="shrink-0 snap-start bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-all active:scale-95">High Altitude</Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
