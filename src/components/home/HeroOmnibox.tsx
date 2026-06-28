"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Activity, ChevronDown, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSearchSuggestions } from '@/app/actions/search';

const MONTHS = [
  'Any Month', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December',
  'This Weekend', 'Next 30 Days'
];

const DIFFICULTIES = ['Any', 'Easy', 'Moderate', 'Difficult', 'Extreme'];

export function HeroOmnibox() {
  const router = useRouter();
  
  // State
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('Any Month');
  const [difficulty, setDifficulty] = useState('Any');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // UI State
  const [activeDropdown, setActiveDropdown] = useState<'destination' | 'month' | 'difficulty' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Data State
  const [suggestions, setSuggestions] = useState<{ destinations: {slug: string; name: string; region_name?: string}[], regions: {slug: string; name: string}[] }>({ destinations: [], regions: [] });
  const [isLoading, setIsLoading] = useState(false);
  
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileModalOpen]);

  // Fetch suggestions with debouncing
  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions({ destinations: [], regions: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetchSearchSuggestions(query);
        setSuggestions(res);
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      } finally {
        setIsLoading(false);
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close and load recent searches
  useEffect(() => {
    const local = localStorage.getItem('tb_recent_searches');
    if (local) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeDropdown !== 'destination') return;

    const totalSuggestions = suggestions.destinations.length + suggestions.regions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalSuggestions - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < totalSuggestions) {
        if (selectedIndex < suggestions.destinations.length) {
          handleSuggestionSelect(suggestions.destinations[selectedIndex].slug, 'destination', suggestions.destinations[selectedIndex].name);
        } else {
          const region = suggestions.regions[selectedIndex - suggestions.destinations.length];
          handleSuggestionSelect(region.slug, 'region', region.name);
        }
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  const handleSuggestionSelect = (slug: string, type: 'destination' | 'region', name: string) => {
    saveRecentSearch(name);
    setActiveDropdown(null);
    if (type === 'destination') {
      router.push(`/master-treks/${slug}`);
    } else {
      router.push(`/regions/${slug}`);
    }
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
    <>
      {/* Mobile Sticky-Style Search Pill */}
      <button
        type="button"
        onClick={() => { setIsMobileModalOpen(true); setTimeout(() => { setActiveDropdown('destination'); inputRef.current?.focus(); }, 100); }}
        className="md:hidden flex items-center justify-start gap-4 w-[90vw] max-w-[360px] bg-white rounded-full py-3.5 px-6 shadow-2xl mx-auto mb-6 active:scale-95 transition-transform border border-zinc-100"
      >
        <Search className="w-5 h-5 text-zinc-900 font-bold" strokeWidth={2.5} />
        <div className="flex flex-col items-start">
          <span className="text-[15px] font-bold text-zinc-900 leading-tight mb-0.5">Start your search</span>
          <span className="text-[12px] font-medium text-zinc-500 leading-tight">Anywhere • Any month</span>
        </div>
      </button>

      {/* Main Search Interface (Desktop Inline, Mobile Modal) */}
      <div className={`${isMobileModalOpen ? 'fixed inset-0 z-[100] bg-[#f7f7f7] flex flex-col' : 'hidden md:block'} transition-opacity duration-300`}>
        
        {isMobileModalOpen && (
          <div className="flex items-center justify-start p-4 bg-[#f7f7f7] md:hidden shrink-0">
            <button 
              type="button"
              onClick={() => { setIsMobileModalOpen(false); setActiveDropdown(null); }}
              className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div ref={containerRef} className={isMobileModalOpen ? 'px-4 relative flex-1 flex flex-col' : 'relative w-full max-w-4xl mx-auto z-50'}>
          <form 
            onSubmit={submitSearch}
            className={`bg-white rounded-3xl md:rounded-full flex flex-col md:flex-row items-center shadow-xl md:shadow-2xl transition-all duration-300 divide-y md:divide-y-0 md:divide-x divide-zinc-200 ${activeDropdown ? 'md:ring-4 md:ring-white/20' : 'md:hover:shadow-tb-medium'}`}
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
            className="bg-tb-primary hover:bg-tb-primary-hover text-white py-3 px-4 md:p-4 rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center w-full md:w-auto md:ml-4 shrink-0 gap-2"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <span className="md:hidden font-semibold">Search</span>
          </button>
        </div>
      </form>

      {/* Mobile Overlay Mask */}
      <AnimatePresence>
        {activeDropdown && !isMobileModalOpen && (
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
            className={isMobileModalOpen 
              ? "relative mt-4 w-full flex-1 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden text-left flex flex-col mb-4" 
              : "fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:left-0 md:mt-4 w-full md:w-[45%] bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl md:border md:border-zinc-100 overflow-hidden text-left z-50"}
          >
            {!isMobileModalOpen && <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />}
            <ul id="destination-listbox" role="listbox" className={isMobileModalOpen ? "py-2 flex-1 overflow-y-auto overscroll-contain" : "py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain pb-safe"}>
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
                <div className="px-6 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Trending Searches</div>
              )}
              
              {query.trim() && isLoading && (
                <li className="p-8 text-center text-zinc-500 font-medium text-base md:text-sm animate-pulse">
                  Searching...
                </li>
              )}
              
              {query.trim() && !isLoading && suggestions.destinations.length === 0 && suggestions.regions.length === 0 && (
                <li className="p-8 text-center text-zinc-500 font-medium text-base md:text-sm">
                  No matches found for &quot;{query}&quot;. Natural language search applies filters automatically.
                </li>
              )}

              {suggestions.destinations.length > 0 && (
                <div className="mb-2">
                  <div className="px-6 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Destinations</div>
                  {suggestions.destinations.map((trek, idx) => (
                    <li key={`dest-${trek.slug}`} role="option" aria-selected={selectedIndex === idx}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(trek.slug, 'destination', trek.name)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full px-6 py-4 flex items-center gap-4 transition-colors text-left ${selectedIndex === idx ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                      >
                        <div className="w-12 h-12 md:w-10 md:h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 md:w-5 md:h-5 text-zinc-400" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-lg md:text-base">{trek.name}</div>
                          <div className="text-sm md:text-xs text-zinc-500 font-medium">{trek.region_name || 'Himalayas'}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </div>
              )}

              {suggestions.regions.length > 0 && (
                <div className="mb-2">
                  <div className="px-6 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Regions</div>
                  {suggestions.regions.map((region, idx) => {
                    const globalIdx = suggestions.destinations.length + idx;
                    return (
                      <li key={`reg-${region.slug}`} role="option" aria-selected={selectedIndex === globalIdx}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionSelect(region.slug, 'region', region.name)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full px-6 py-4 flex items-center gap-4 transition-colors text-left ${selectedIndex === globalIdx ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                        >
                          <div className="w-12 h-12 md:w-10 md:h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                            <Activity className="w-6 h-6 md:w-5 md:h-5 text-zinc-400" />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 text-lg md:text-base">{region.name} Region</div>
                            <div className="text-sm md:text-xs text-zinc-500 font-medium">Explore all treks</div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </div>
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
            className={isMobileModalOpen
              ? "relative mt-4 w-full flex-1 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden text-left flex flex-col mb-4"
              : "fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:left-[35%] md:mt-4 w-full md:w-[60%] lg:w-64 bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl md:border md:border-zinc-100 overflow-hidden text-left z-50"}
          >
            {!isMobileModalOpen && <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />}
            <ul className={isMobileModalOpen ? "py-2 flex-1 overflow-y-auto overscroll-contain" : "py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain hide-scrollbar pb-safe"}>
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
            className={isMobileModalOpen
              ? "relative mt-4 w-full flex-1 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden text-left flex flex-col mb-4"
              : "fixed inset-x-0 bottom-0 md:absolute md:top-full md:bottom-auto md:right-0 md:mt-4 w-full md:w-[60%] lg:w-64 bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl md:border md:border-zinc-100 overflow-hidden text-left z-50"}
          >
            {!isMobileModalOpen && <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-3 mb-2 md:hidden" />}
            <ul className={isMobileModalOpen ? "py-2 flex-1 overflow-y-auto overscroll-contain" : "py-2 max-h-[60vh] md:max-h-[50vh] overflow-y-auto overscroll-contain hide-scrollbar pb-safe"}>
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
      </div>
    </>
  );
}
