"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '../layout/Container';

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image 
        src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2400"
        alt="Snowy Himalayan Peak"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Gradient Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      {/* Content */}
      <Container className="relative z-10 w-full pt-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg leading-tight">
            Discover the Highest <br className="hidden md:block" />
            <span className="text-white/90">Peaks of India.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-medium drop-shadow-md">
            Compare handpicked expeditions from verified operators. 
            Find your perfect trek based on region, difficulty, and season.
          </p>

          {/* Glassmorphic Search Pill */}
          <form 
            onSubmit={handleSearch} 
            className="w-full max-w-2xl bg-white/20 backdrop-blur-md border border-white/30 p-2 md:p-3 rounded-full flex flex-col sm:flex-row gap-2 shadow-2xl transition-transform focus-within:scale-[1.02]"
          >
            <label htmlFor="hero-search" className="sr-only">Search Treks</label>
            <div className="relative flex-1 flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                id="hero-search"
                type="text" 
                placeholder="Where to? (e.g. Kedarkantha, Spiti...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-transparent focus:outline-none text-white placeholder:text-white/70 text-lg font-medium"
              />
            </div>
            <button 
              type="submit" 
              className="bg-white text-tb-text-primary px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-tb-sys-background transition-colors shadow-lg shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-white/80">
            <span className="opacity-70 uppercase tracking-widest text-xs mr-2">Trending</span>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full transition-colors">Uttarakhand</a>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full transition-colors">Himachal Pradesh</a>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full transition-colors">Winter Treks</a>
          </div>

        </div>
      </Container>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70 hidden md:block">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
