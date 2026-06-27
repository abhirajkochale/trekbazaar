"use client";

import React, { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'recommended';

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'recommended') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    // Changing sort typically brings you back to page 1 to ensure a consistent experience
    params.delete('page');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-dropdown" className="text-sm font-medium text-tb-text-secondary">Sort by:</label>
      <select 
        id="sort-dropdown"
        value={currentSort}
        onChange={handleSortChange}
        className="text-sm font-medium text-tb-text-primary border border-tb-border rounded-tb-md pl-3 pr-8 py-2 bg-tb-sys-background hover:bg-tb-border/50 focus:outline-none focus:border-tb-primary focus:ring-1 focus:ring-tb-primary cursor-pointer transition-colors appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.25em 1.25em'
        }}
        aria-label="Sort treks"
      >
        <option value="recommended">Recommended</option>
        <option value="newest">Newest</option>
        <option value="lowest-price">Price: Low to High</option>
        <option value="highest-price">Price: High to Low</option>
        <option value="most-companies">Most Companies</option>
        <option value="most-departures">Most Departures</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}
