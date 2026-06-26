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
    <div className="flex items-center gap-3 w-full md:max-w-lg">
      <div className="relative flex-1 group">
        <label htmlFor="search-input" className="sr-only">Search treks</label>
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-tb-text-tertiary group-focus-within:text-tb-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input 
          id="search-input"
          type="text" 
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by trek, region, or keyword..." 
          className="w-full pl-11 pr-10 py-3 border border-tb-border rounded-tb-md bg-tb-sys-background text-base font-medium text-tb-text-primary focus:outline-none focus:border-tb-primary focus:ring-1 focus:ring-tb-primary transition-all placeholder:text-tb-text-tertiary"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-tb-text-tertiary hover:text-tb-text-primary transition-colors focus:outline-none focus:text-tb-primary"
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
        className="px-8 shrink-0"
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
}
