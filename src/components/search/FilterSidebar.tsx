"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const REGIONS = ['Uttarakhand', 'Himachal Pradesh', 'Kashmir', 'Ladakh', 'Sikkim'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Difficult'];

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRegionParam = searchParams.get('region') || '';
  const currentDiffParam = searchParams.get('difficulty') || '';
  const currentDurParam = searchParams.get('duration') || '';
  const currentMinPParam = searchParams.get('minPrice') || '';
  const currentMaxPParam = searchParams.get('maxPrice') || '';

  const [regions, setRegions] = useState<string[]>(currentRegionParam ? currentRegionParam.split(',').map(s => s.trim()) : []);
  const [difficulty, setDifficulty] = useState<string>(currentDiffParam);
  const [duration, setDuration] = useState<number>(currentDurParam ? parseInt(currentDurParam, 10) : 15);
  const [minPrice, setMinPrice] = useState<number>(currentMinPParam ? parseInt(currentMinPParam, 10) : 5000);
  const [maxPrice, setMaxPrice] = useState<number>(currentMaxPParam ? parseInt(currentMaxPParam, 10) : 50000);

  const [prevRegionParam, setPrevRegionParam] = useState(currentRegionParam);
  const [prevDiffParam, setPrevDiffParam] = useState(currentDiffParam);
  const [prevDurParam, setPrevDurParam] = useState(currentDurParam);
  const [prevMinPParam, setPrevMinPParam] = useState(currentMinPParam);
  const [prevMaxPParam, setPrevMaxPParam] = useState(currentMaxPParam);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync state from URL by deriving during render
  if (currentRegionParam !== prevRegionParam) {
    setRegions(currentRegionParam ? currentRegionParam.split(',').map(s => s.trim()) : []);
    setPrevRegionParam(currentRegionParam);
  }
  if (currentDiffParam !== prevDiffParam) {
    setDifficulty(currentDiffParam);
    setPrevDiffParam(currentDiffParam);
  }
  if (currentDurParam !== prevDurParam) {
    setDuration(currentDurParam ? parseInt(currentDurParam, 10) : 15);
    setPrevDurParam(currentDurParam);
  }
  if (currentMinPParam !== prevMinPParam) {
    setMinPrice(currentMinPParam ? parseInt(currentMinPParam, 10) : 5000);
    setPrevMinPParam(currentMinPParam);
  }
  if (currentMaxPParam !== prevMaxPParam) {
    setMaxPrice(currentMaxPParam ? parseInt(currentMaxPParam, 10) : 50000);
    setPrevMaxPParam(currentMaxPParam);
  }

  // Utility to update URL
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const debouncedUpdate = (updates: Record<string, string | null>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateUrl(updates);
    }, 400);
  };

  // Handlers
  const toggleRegion = (reg: string) => {
    const current = new Set(regions);
    if (current.has(reg.toLowerCase())) {
      current.delete(reg.toLowerCase());
    } else {
      current.add(reg.toLowerCase());
    }
    const newRegions = Array.from(current);
    setRegions(newRegions);
    updateUrl({ region: newRegions.length > 0 ? newRegions.join(',') : null });
  };

  const handleDifficulty = (diff: string) => {
    const val = diff.toLowerCase();
    const newVal = difficulty === val ? '' : val;
    setDifficulty(newVal);
    updateUrl({ difficulty: newVal || null });
  };

  const handleDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDuration(val);
    debouncedUpdate({ duration: val === 15 ? null : val.toString() }); // default max is 15, so null if 15
  };

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // prevent crossing
    const boundedVal = Math.min(val, maxPrice - 1000);
    setMinPrice(boundedVal);
    debouncedUpdate({ minPrice: boundedVal === 5000 ? null : boundedVal.toString(), maxPrice: maxPrice === 50000 ? null : maxPrice.toString() });
  };

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const boundedVal = Math.max(val, minPrice + 1000);
    setMaxPrice(boundedVal);
    debouncedUpdate({ minPrice: minPrice === 5000 ? null : minPrice.toString(), maxPrice: boundedVal === 50000 ? null : boundedVal.toString() });
  };

  const formatPrice = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 sticky top-[180px] shadow-sm overflow-y-auto max-h-[calc(100vh-200px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-zinc-900">Filters</h3>
        {/* Clear Filters could go here */}
      </div>
      
      {/* Region Filter */}
      <div className="mb-10">
        <h4 className="text-xs font-bold text-zinc-900 mb-4 uppercase tracking-widest">Region</h4>
        <div className="space-y-4">
          {REGIONS.map(reg => (
            <label key={reg} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0">
                <input 
                  type="checkbox"
                  className="peer sr-only"
                  checked={regions.includes(reg.toLowerCase())}
                  onChange={() => toggleRegion(reg)}
                />
                <div className="w-6 h-6 border-2 border-zinc-300 rounded-[6px] peer-checked:bg-zinc-900 peer-checked:border-zinc-900 transition-all group-hover:border-zinc-400"></div>
                <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">{reg}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-zinc-100 mb-8" />

      {/* Difficulty Filter */}
      <div className="mb-10">
        <h4 className="text-xs font-bold text-zinc-900 mb-4 uppercase tracking-widest">Difficulty</h4>
        <div className="space-y-4">
          {DIFFICULTIES.map(diff => (
            <label key={diff} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0">
                <input 
                  type="radio"
                  name="difficulty"
                  className="peer sr-only"
                  checked={difficulty === diff.toLowerCase()}
                  onChange={() => handleDifficulty(diff)}
                />
                <div className="w-6 h-6 border-2 border-zinc-300 rounded-full peer-checked:border-zinc-900 transition-all group-hover:border-zinc-400"></div>
                <div className="absolute w-3 h-3 bg-zinc-900 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-50 peer-checked:scale-100 transition-all"></div>
              </div>
              <span className="text-base font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-zinc-100 mb-8" />

      {/* Duration Filter */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Duration</h4>
          <span className="text-sm font-bold text-tb-primary bg-tb-primary/10 px-2 py-1 rounded-md">Up to {duration} days</span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="2" 
            max="15" 
            step="1"
            value={duration}
            onChange={handleDuration}
            className="w-full accent-zinc-900 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Duration up to"
          />
        </div>
      </div>

      <hr className="border-zinc-100 mb-8" />

      {/* Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Price</h4>
        </div>
        <div className="relative h-12 w-full pt-2">
          {/* Track */}
          <div className="absolute top-4 left-0 right-0 h-2 bg-zinc-200 rounded-full"></div>
          {/* Active Track */}
          <div 
            className="absolute top-4 h-2 bg-zinc-900 rounded-full pointer-events-none" 
            style={{ 
              left: `${((minPrice - 5000) / 45000) * 100}%`, 
              right: `${100 - ((maxPrice - 5000) / 45000) * 100}%` 
            }}
          ></div>
          
          <input 
            type="range" 
            min="5000" 
            max="50000" 
            step="1000"
            value={minPrice}
            onChange={handleMinPrice}
            className="absolute top-4 left-0 w-full appearance-none bg-transparent pointer-events-auto h-2 z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
            aria-label="Minimum Price"
          />
          <input 
            type="range" 
            min="5000" 
            max="50000" 
            step="1000"
            value={maxPrice}
            onChange={handleMaxPrice}
            className="absolute top-4 left-0 w-full appearance-none bg-transparent pointer-events-auto h-2 z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
            aria-label="Maximum Price"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Min</span>
            <span className="text-sm font-bold text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg mt-1">{formatPrice(minPrice)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Max</span>
            <span className="text-sm font-bold text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg mt-1">{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
