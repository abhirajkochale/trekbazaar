"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Activity, ChevronDown, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
}

const MONTHS = [
  'Any Month', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December',
  'This Weekend', 'Next 30 Days'
];

const DIFFICULTIES = ['Any', 'Easy', 'Moderate', 'Difficult', 'Extreme'];

export function HeroOmnibox({ masterTreks }: Props) {
  const router = useRouter();
  
  // State
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('Any Month');
  const [difficulty, setDifficulty] = useState('Any');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // UI State
  const [activeDropdown, setActiveDropdown] = useState<'destination' | 'month' | 'difficulty' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuse configuration
  const fuse = useMemo(() => {
    return new Fuse(masterTreks, {
      keys: ['name', 'region.name', 'category.name', 'difficulty', 'best_season'],
      threshold: 0.3,
      distance: 100,
      includeScore: true,
    });
  }, [masterTreks]);

  // Suggestions logic
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      // Return popular destinations if empty
      return masterTreks
        .sort((a, b) => b.aggregated?.companiesCount - a.aggregated?.companiesCount)
        .slice(0, 5);
    }
    
    // Fuzzy search
    const results = fuse.search(query).slice(0, 8);
    return results.map(r => r.item);
  }, [query, fuse, masterTreks]);

  // Click outside to close and load recent searches
  useEffect(() => {
    const local = localStorage.getItem('tb_recent_searches');
    if (local) {
      try {
        setRecentSearches(JSON.parse(local));
      } catch (e) {}
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('tb_recent_searches', JSON.stringify(updated));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeDropdown !== 'destination') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSuggestionSelect(suggestions[selectedIndex].slug);
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  const handleSuggestionSelect = (slug: string) => {
    const trek = masterTreks.find(t => t.slug === slug);
    if (trek) saveRecentSearch(trek.name);
    
    setActiveDropdown(null);
    router.push(`/master-treks/${slug}`);
  };

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveDropdown(null);
    
    if (query.trim()) saveRecentSearch(query.trim());
    
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (month !== 'Any Month') params.set('season', month);
    if (difficulty !== 'Any') params.set('difficulty', difficulty);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-50">
      <form 
        onSubmit={submitSearch}
        className={`bg-white rounded-3xl md:rounded-full flex flex-col md:flex-row items-center shadow-2xl transition-all duration-300 divide-y md:divide-y-0 md:divide-x divide-zinc-200 ${activeDropdown ? 'ring-4 ring-white/20' : 'hover:shadow-tb-medium'}`}
      >
        {/* 1. Destination Input */}
        <div 
          className={`flex-[1.5] w-full px-6 py-4 md:px-8 md:py-3.5 transition-colors rounded-t-3xl md:rounded-t-none md:rounded-l-full group cursor-text relative text-left bg-transparent hover:bg-zinc-100/50 ${activeDropdown === 'destination' ? 'bg-white shadow-xl z-10 md:rounded-full' : ''}`}
          onClick={() => {
            setActiveDropdown('destination');
            inputRef.current?.focus();
          }}
        >
          <label htmlFor="hero-destination" className="block text-[10px] md:text-xs font-bold text-zinc-900 tracking-wide uppercase">Destination</label>
          <input 
            ref={inputRef}
            id="hero-destination"
            type="text" 
            placeholder="Search treks, regions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
              if (activeDropdown !== 'destination') setActiveDropdown('destination');
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setActiveDropdown('destination')}
            className="w-full bg-transparent focus:outline-none text-zinc-900 placeholder:text-zinc-500 text-base font-medium truncate mt-0.5"
            autoComplete="off"
            role="combobox"
            aria-expanded={activeDropdown === 'destination'}
            aria-controls="destination-listbox"
          />
        </div>

        {/* 2. Month Dropdown */}
        <div 
          className={`flex-1 w-full px-6 py-4 md:px-8 md:py-3.5 transition-colors group cursor-pointer text-left hover:bg-zinc-100/50 ${activeDropdown === 'month' ? 'bg-white shadow-xl z-10 md:rounded-full' : ''}`}
          onClick={() => setActiveDropdown(activeDropdown === 'month' ? null : 'month')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="block text-[10px] md:text-xs font-bold text-zinc-900 tracking-wide uppercase">When</div>
              <div className="text-base text-zinc-500 font-medium truncate mt-0.5">{month}</div>
            </div>
            <ChevronDown className="w-5 h-5 md:w-4 md:h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
        </div>

        {/* 3. Difficulty Dropdown & Search Button */}
        <div 
          className={`flex-1 w-full px-6 py-4 md:pl-8 md:pr-2 md:py-2 transition-colors rounded-b-3xl md:rounded-b-none md:rounded-r-full group cursor-pointer flex flex-col md:flex-row md:items-center justify-between hover:bg-zinc-100/50 ${activeDropdown === 'difficulty' ? 'bg-white shadow-xl z-10 md:rounded-full' : ''}`}
          onClick={(e) => {
            // Prevent opening dropdown if clicking the search button
            if ((e.target as HTMLElement).closest('button')) return;
            setActiveDropdown(activeDropdown === 'difficulty' ? null : 'difficulty');
          }}
        >
          <div className="text-left mb-4 md:mb-0 w-full md:w-auto flex justify-between items-center">
            <div>
              <div className="block text-[10px] md:text-xs font-bold text-zinc-900 tracking-wide uppercase">Difficulty</div>
              <div className="text-base text-zinc-500 font-medium truncate mt-0.5">{difficulty}</div>
            </div>
            <ChevronDown className="w-5 h-5 md:hidden text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
          
          <button 
            type="submit" 
            className="bg-tb-primary hover:bg-tb-primary-hover text-white py-3 px-4 md:p-4 rounded-xl md:rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center w-full md:w-auto md:ml-4 shrink-0 gap-2"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <span className="md:hidden font-semibold">Search</span>
          </button>
        </div>
      </form>

      {/* Mobile Overlay Mask */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      {/* Dropdown Menus */}
      <AnimatePresence>
        {activeDropdown === 'destination' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:left-0 md:mt-4 w-full md:w-[45%] bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl border border-zinc-100 overflow-hidden text-left z-50"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />
            <ul id="destination-listbox" role="listbox" className="py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain pb-safe">
              {!query.trim() && recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="px-6 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Recent Searches</div>
                  {recentSearches.map((term, idx) => (
                    <li key={`recent-${idx}`}>
                      <button
                        type="button"
                        onClick={() => { setQuery(term); setActiveDropdown('destination'); }}
                        className="w-full px-6 py-3 flex items-center gap-3 transition-colors text-left hover:bg-zinc-50"
                      >
                        <Clock className="w-4 h-4 text-zinc-300" />
                        <span className="font-medium text-zinc-700 text-sm">{term}</span>
                      </button>
                    </li>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="px-6 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Trending Destinations</div>
              )}
              {suggestions.length > 0 ? (
                suggestions.map((trek, idx) => (
                  <li key={trek.id} role="option" aria-selected={selectedIndex === idx}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionSelect(trek.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-6 py-4 flex items-center gap-4 transition-colors text-left ${selectedIndex === idx ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                    >
                      <div className="w-12 h-12 md:w-10 md:h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 md:w-5 md:h-5 text-zinc-400" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-lg md:text-base">{trek.name}</div>
                        <div className="text-sm md:text-xs text-zinc-500 font-medium">{trek.region?.name || 'Himalayas'}</div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-zinc-500 font-medium text-base md:text-sm">
                  No matches found for &quot;{query}&quot;. Try a different keyword!
                </li>
              )}
            </ul>
          </motion.div>
        )}

        {activeDropdown === 'month' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:left-[35%] md:mt-4 w-full md:w-[60%] lg:w-64 bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl border border-zinc-100 overflow-hidden text-left z-50"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />
            <ul className="py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain hide-scrollbar pb-safe">
              {MONTHS.map(m => (
                <li key={m}>
                  <button
                    type="button"
                    onClick={() => { setMonth(m); setActiveDropdown('difficulty'); }}
                    className={`w-full px-6 py-4 md:py-3 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors ${month === m ? 'font-bold text-tb-primary bg-zinc-50' : 'font-medium text-zinc-700'}`}
                  >
                    <span className="text-lg md:text-base">{m}</span>
                    {month === m && <div className="w-2.5 h-2.5 md:w-2 md:h-2 rounded-full bg-tb-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {activeDropdown === 'difficulty' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:right-0 md:mt-4 w-full md:w-[60%] lg:w-64 bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl border border-zinc-100 overflow-hidden text-left z-50"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />
            <ul className="py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain hide-scrollbar pb-safe">
              {DIFFICULTIES.map(d => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() => { setDifficulty(d); setActiveDropdown(null); }}
                    className={`w-full px-6 py-4 md:py-3 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors ${difficulty === d ? 'font-bold text-tb-primary bg-zinc-50' : 'font-medium text-zinc-700'}`}
                  >
                    <span className="text-lg md:text-base">{d}</span>
                    {difficulty === d && <div className="w-2.5 h-2.5 md:w-2 md:h-2 rounded-full bg-tb-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
