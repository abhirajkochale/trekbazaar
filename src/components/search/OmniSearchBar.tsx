"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

export function OmniSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(currentQuery);
  const [prevQueryParam, setPrevQueryParam] = useState(currentQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local state if URL changes via Browser Back/Forward navigation
  // Deriving state during render avoids the react-hooks/set-state-in-effect warning
  if (currentQuery !== prevQueryParam) {
    setQuery(currentQuery);
    setPrevQueryParam(currentQuery);
  }

  const updateUrl = useCallback((newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQuery.trim()) {
      params.set('q', newQuery.trim());
    } else {
      params.delete('q');
    }
    
    // Always reset to page 1 on a new text search
    params.delete('page');
    
    // Use replace for typing to avoid massive browser history stacks
    // Use push for explicit actions (like pressing Enter or clicking Search)
    // For simplicity in this requirement, we use push, but replace is better for debounce.
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateUrl(val);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      updateUrl(query);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setQuery('');
      updateUrl('');
    }
  };

  const handleClear = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setQuery('');
    updateUrl('');
  };

  const handleSearchClick = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    updateUrl(query);
  };

  return (
    <div className="flex items-center w-full md:max-w-lg bg-white border border-zinc-200 rounded-full shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-tb-primary focus-within:border-tb-primary transition-all pl-4 pr-1.5 py-1.5">
      <div className="relative flex-1 flex items-center group">
        <label htmlFor="search-input" className="sr-only">Search treks</label>
        
        {/* Search Icon */}
        <div className="flex items-center text-zinc-400 group-focus-within:text-tb-primary transition-colors shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input 
          id="search-input"
          type="text" 
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by trek, region, or keyword..." 
          className="w-full px-3 py-2 bg-transparent text-[15px] font-medium text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 flex items-center text-zinc-300 hover:text-zinc-600 transition-colors focus:outline-none"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <Button 
        size="lg" 
        variant="primary" 
        className="px-6 h-[42px] shrink-0 rounded-full font-bold shadow-sm"
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
}
