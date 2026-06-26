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
    <div className="bg-white border border-tb-border rounded-tb-md p-6 h-max sticky top-[160px]">
      <h3 className="text-lg font-bold text-tb-text-primary mb-6">Filters</h3>
      
      {/* Region Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-tb-text-primary mb-3 uppercase tracking-wide">Region</h4>
        <div className="space-y-3">
          {REGIONS.map(reg => (
            <label key={reg} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox"
                  className="peer sr-only"
                  checked={regions.includes(reg.toLowerCase())}
                  onChange={() => toggleRegion(reg)}
                />
                <div className="w-5 h-5 border-2 border-tb-text-tertiary rounded-sm peer-checked:bg-tb-primary peer-checked:border-tb-primary transition-all group-hover:border-tb-primary"></div>
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-tb-text-secondary group-hover:text-tb-text-primary transition-colors">{reg}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-tb-text-primary mb-3 uppercase tracking-wide">Difficulty</h4>
        <div className="space-y-3">
          {DIFFICULTIES.map(diff => (
            <label key={diff} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio"
                  name="difficulty"
                  className="peer sr-only"
                  checked={difficulty === diff.toLowerCase()}
                  onChange={() => handleDifficulty(diff)}
                />
                <div className="w-5 h-5 border-2 border-tb-text-tertiary rounded-full peer-checked:border-tb-primary transition-all group-hover:border-tb-primary"></div>
                <div className="absolute w-2.5 h-2.5 bg-tb-primary rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-0 peer-checked:scale-100 transition-all"></div>
              </div>
              <span className="text-sm font-medium text-tb-text-secondary group-hover:text-tb-text-primary transition-colors">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-tb-text-primary uppercase tracking-wide">Duration</h4>
          <span className="text-xs font-medium text-tb-text-secondary bg-tb-sys-background px-2 py-1 rounded-md">2–{duration} days</span>
        </div>
        <input 
          type="range" 
          min="2" 
          max="15" 
          step="1"
          value={duration}
          onChange={handleDuration}
          className="w-full accent-tb-primary"
          aria-label="Duration up to"
        />
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-tb-text-primary uppercase tracking-wide">Price</h4>
        </div>
        <div className="relative h-12 w-full pt-2">
          {/* Track */}
          <div className="absolute top-4 left-0 right-0 h-1.5 bg-tb-sys-background rounded-full"></div>
          {/* Active Track */}
          <div 
            className="absolute top-4 h-1.5 bg-tb-primary rounded-full pointer-events-none" 
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
            className="absolute top-4 left-0 w-full appearance-none bg-transparent pointer-events-auto h-1.5 z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tb-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Minimum Price"
          />
          <input 
            type="range" 
            min="5000" 
            max="50000" 
            step="1000"
            value={maxPrice}
            onChange={handleMaxPrice}
            className="absolute top-4 left-0 w-full appearance-none bg-transparent pointer-events-auto h-1.5 z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-tb-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Maximum Price"
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium text-tb-text-secondary">{formatPrice(minPrice)}</span>
          <span className="text-xs font-medium text-tb-text-secondary">{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
}
