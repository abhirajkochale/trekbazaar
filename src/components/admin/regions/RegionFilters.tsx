"use client";

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function RegionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set('q', e.target.value);
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-6">
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          defaultValue={searchParams.get('q') || ''}
          onChange={handleSearch}
          className="block w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-tb-primary focus:border-tb-primary sm:text-sm transition-colors"
          placeholder="Search regions by name or slug..."
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label htmlFor="sort" className="text-sm font-medium text-zinc-700 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort"
          defaultValue={searchParams.get('sort') || 'recent'}
          onChange={handleSort}
          className="block w-full py-2 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
        >
          <option value="recent">Recently Added</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="trek_count">Trek Count</option>
        </select>
      </div>
    </div>
  );
}
