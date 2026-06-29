import React from 'react';
import { Container } from '../layout/Container';
import { OmniSearchBar } from './OmniSearchBar';
import { SortDropdown } from './SortDropdown';

interface SearchHeaderProps {
  totalCount: number;
}

export function SearchHeader({ totalCount }: SearchHeaderProps) {
  return (
    <div className="border-b border-tb-border bg-white sticky top-[64px] md:top-[72px] z-40 shadow-sm transition-all">
      <Container>
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <OmniSearchBar />
          
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 border-t border-tb-border md:border-t-0 pt-4 md:pt-0">
            <span className="text-sm font-bold text-tb-text-primary tracking-wide uppercase">
              {totalCount === 1 ? '1 trek found' : `${totalCount} treks found`}
            </span>
            <SortDropdown />
          </div>
        </div>
      </Container>
    </div>
  );
}
