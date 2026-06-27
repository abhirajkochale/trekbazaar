"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks?: any[];
}

export function HeroSection({ masterTreks = [] }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'experiences'>('search');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(masterTreks, {
      keys: ['name', 'region.name', 'category.name'],
      threshold: 0.4,
      distance: 100,
    });
  }, [masterTreks]);

  // Get search suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 5).map(result => result.item);
  }, [query, fuse]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setIsFocused(false);
    router.push(`/master-treks/${slug}`);
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
          <div ref={dropdownRef} className="relative w-full max-w-4xl mx-auto z-50">
            <form 
              onSubmit={handleSearch} 
              className={`bg-white rounded-full flex flex-col md:flex-row items-center shadow-2xl transition-all duration-300 divide-y md:divide-y-0 md:divide-x divide-zinc-200 ${isFocused ? 'ring-4 ring-white/20' : 'hover:shadow-tb-medium'}`}
            >
              {/* Destination */}
              <div className="flex-1 w-full px-8 py-3.5 transition-colors md:rounded-l-full group cursor-text relative text-left bg-transparent hover:bg-zinc-100/50 focus-within:bg-white focus-within:shadow-xl focus-within:z-10 focus-within:rounded-full">
                <label htmlFor="hero-search" className="block text-xs font-bold text-zinc-900 tracking-wide uppercase">Destination</label>
                <input 
                  id="hero-search"
                  type="text" 
                  placeholder="Search treks, regions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="w-full bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-500 text-sm sm:text-base font-medium truncate"
                  autoComplete="off"
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
                  className="bg-tb-primary hover:bg-tb-primary-hover text-white p-4 rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center ml-4"
                >
                  <Search className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
              {isFocused && query.trim().length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-4 w-full md:w-[45%] bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden text-left"
                >
                  {suggestions.length > 0 ? (
                    <ul className="py-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {suggestions.map((trek: any) => (
                        <li key={trek.id}>
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(trek.slug)}
                            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900 text-base">{trek.name}</div>
                              <div className="text-xs text-zinc-500 font-medium">{trek.region?.name || 'Himalayas'}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-zinc-500 font-medium text-sm">
                      Press enter to search for &quot;{query}&quot;
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-white/80">
            <span className="opacity-70 uppercase tracking-widest text-xs mr-2">Trending</span>
            <button onClick={() => { setQuery('Kedarkantha'); setIsFocused(true); }} className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Kedarkantha</button>
            <button onClick={() => { setQuery('Hampta'); setIsFocused(true); }} className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Hampta Pass</button>
            <button onClick={() => { setQuery('Kashmir'); setIsFocused(true); }} className="bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full transition-colors">Kashmir Great Lakes</button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
