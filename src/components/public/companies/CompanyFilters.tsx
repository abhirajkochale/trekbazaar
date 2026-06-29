"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Compass, SlidersHorizontal, X } from 'lucide-react';

export function CompanyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters({ q, state, sort });
    }, 400);
    return () => clearTimeout(handler);
  }, [q, state, sort]);

  const applyFilters = (filters: { q: string; state: string; sort: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.q) params.set('q', filters.q);
    else params.delete('q');
    
    if (filters.state) params.set('state', filters.state);
    else params.delete('state');
    
    if (filters.sort) params.set('sort', filters.sort);
    else params.delete('sort');
    
    router.push(`/companies?${params.toString()}`);
  };

  const clearFilters = () => {
    setQ('');
    setState('');
    setSort('');
    router.push('/companies');
  };

  const states = [
    "Uttarakhand",
    "Himachal Pradesh",
    "Maharashtra",
    "Karnataka",
    "Jammu and Kashmir",
    "Sikkim",
    "West Bengal",
  ];

  const hasActiveFilters = searchParams.get('q') || searchParams.get('state') || searchParams.get('sort');

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-tb-primary" />
          Filter Partners
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-zinc-500 hover:text-tb-primary transition-colors flex items-center gap-1"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Company name or city..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tb-primary/20 focus:border-tb-primary transition-all"
            />
            {q && (
              <button 
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tb-primary/20 focus:border-tb-primary transition-all appearance-none"
          >
            <option value="">All States</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Sort By
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="sort" 
                value="" 
                checked={sort === ''}
                onChange={() => setSort('')}
                className="w-4 h-4 text-tb-primary border-zinc-300 focus:ring-tb-primary"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">Recommended</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="sort" 
                value="price_asc" 
                checked={sort === 'price_asc'}
                onChange={() => setSort('price_asc')}
                className="w-4 h-4 text-tb-primary border-zinc-300 focus:ring-tb-primary"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">Lowest Price First</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="sort" 
                value="active_desc" 
                checked={sort === 'active_desc'}
                onChange={() => setSort('active_desc')}
                className="w-4 h-4 text-tb-primary border-zinc-300 focus:ring-tb-primary"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">Most Treks</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
