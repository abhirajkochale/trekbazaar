import React from 'react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

interface SearchHeaderProps {
  totalCount: number;
  initialQuery?: string;
}

export function SearchHeader({ totalCount, initialQuery = '' }: SearchHeaderProps) {
  return (
    <div className="border-b border-tb-border bg-white sticky top-16 z-40">
      <Container>
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <label htmlFor="search-input-placeholder" className="sr-only">Search</label>
              <input 
                id="search-input-placeholder"
                type="text" 
                placeholder="Search by trek, region, or keyword..." 
                defaultValue={initialQuery}
                className="w-full pl-4 pr-10 py-2 border border-tb-border rounded-tb-md bg-tb-sys-background text-sm focus:outline-none focus:border-tb-primary"
                readOnly
              />
            </div>
            <Button size="md" variant="primary">Search</Button>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="text-sm font-medium text-tb-text-secondary">
              {totalCount === 1 ? '1 trek found' : `${totalCount} treks found`}
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-placeholder" className="text-sm text-tb-text-secondary sr-only">Sort by</label>
              <select 
                id="sort-placeholder"
                className="text-sm border border-tb-border rounded-tb-md px-3 py-2 bg-white focus:outline-none"
                disabled
              >
                <option>Sort by: Recommended</option>
              </select>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
