"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'experiences'>('search');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with motion */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
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
      
      {/* Gradient Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-0" />

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
          className="text-center w-full max-w-4xl"
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg leading-[1.1]">
            Find your next <br className="hidden md:block" />
            <span className="text-white/90">Himalayan adventure.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Compare verified operators, find the best prices, and book your departure in minutes.
          </p>

          {/* Airbnb-style Omnibox */}
          <form 
            onSubmit={handleSearch} 
            className="w-full max-w-4xl mx-auto bg-white rounded-full flex flex-col md:flex-row items-center shadow-2xl transition-all duration-300 hover:shadow-tb-medium divide-y md:divide-y-0 md:divide-x divide-zinc-200"
          >
            {/* Destination */}
            <div className="flex-1 w-full px-8 py-3.5 hover:bg-zinc-100/50 transition-colors md:rounded-l-full group cursor-text relative text-left">
              <label htmlFor="hero-search" className="block text-xs font-bold text-zinc-900 tracking-wide uppercase">Destination</label>
              <input 
                id="hero-search"
                type="text" 
                placeholder="Search treks, regions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-500 text-sm sm:text-base font-medium truncate"
              />
            </div>

            {/* Date/Season */}
            <div className="flex-1 w-full px-8 py-3.5 hover:bg-zinc-100/50 transition-colors group cursor-pointer text-left">
              <div className="block text-xs font-bold text-zinc-900 tracking-wide uppercase">When</div>
              <div className="text-sm sm:text-base text-zinc-500 font-medium truncate">Any week</div>
            </div>

            {/* Difficulty */}
            <div className="flex-1 w-full pl-8 pr-2 py-2 hover:bg-zinc-100/50 transition-colors md:rounded-r-full group cursor-pointer flex items-center justify-between">
              <div className="text-left">
                <div className="block text-xs font-bold text-zinc-900 tracking-wide uppercase">Difficulty</div>
                <div className="text-sm sm:text-base text-zinc-500 font-medium truncate">Any difficulty</div>
              </div>
              
              <button 
                type="submit" 
                className="bg-tb-primary hover:bg-tb-primary-hover text-white p-3.5 rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center ml-4"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-white/80">
            <span className="opacity-70 uppercase tracking-widest text-xs mr-2">Trending</span>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Kedarkantha</a>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Valley of Flowers</a>
            <a href="#featured-regions" className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Hampta Pass</a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
