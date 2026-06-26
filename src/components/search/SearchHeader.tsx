import React from 'react';
import { Container } from '../layout/Container';
import { OmniSearchBar } from './OmniSearchBar';

interface SearchHeaderProps {
  totalCount: number;
}

export function SearchHeader({ totalCount }: SearchHeaderProps) {
  return (
    <div className="border-b border-tb-border bg-white sticky top-[64px] md:top-[68px] z-40 shadow-sm transition-all">
      <Container>
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <OmniSearchBar />
          
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 border-t border-tb-border md:border-t-0 pt-4 md:pt-0">
            <span className="text-sm font-semibold text-tb-text-secondary tracking-wide uppercase">
              {totalCount === 1 ? '1 trek found' : `${totalCount} treks found`}
            </span>
            <div className="flex items-center gap-3">
              <label htmlFor="sort-dropdown" className="text-sm font-medium text-tb-text-secondary">Sort by:</label>
              <select 
                id="sort-dropdown"
                className="text-sm font-medium text-tb-text-primary border border-tb-border rounded-tb-md pl-3 pr-8 py-2 bg-tb-sys-background hover:bg-tb-border/50 focus:outline-none focus:border-tb-primary focus:ring-1 focus:ring-tb-primary cursor-pointer transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25em 1.25em'
                }}
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
