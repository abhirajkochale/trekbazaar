import React from 'react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

interface SearchHeaderProps {
  totalCount: number;
  initialQuery?: string;
}

export function SearchHeader({ totalCount, initialQuery = '' }: SearchHeaderProps) {
  return (
    <div className="border-b border-tb-border bg-white sticky top-[64px] md:top-[68px] z-40 shadow-sm transition-all">
      <Container>
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 w-full md:max-w-lg">
            <div className="relative flex-1 group">
              <label htmlFor="search-input" className="sr-only">Search treks</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-tb-text-tertiary group-focus-within:text-tb-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                id="search-input"
                type="text" 
                placeholder="Search by trek, region, or keyword..." 
                defaultValue={initialQuery}
                className="w-full pl-11 pr-4 py-3 border border-tb-border rounded-tb-md bg-tb-sys-background text-base font-medium text-tb-text-primary focus:outline-none focus:border-tb-primary focus:ring-1 focus:ring-tb-primary transition-all placeholder:text-tb-text-tertiary"
              />
            </div>
            <Button size="lg" variant="primary" className="px-8 shrink-0">Search</Button>
          </div>
          
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
