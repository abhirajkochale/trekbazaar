import React from 'react';
import Link from 'next/link';

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-tb-border rounded-tb-md">
      <div className="w-24 h-24 bg-tb-sys-background rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-tb-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-tb-text-primary mb-2">No trekking destinations matched your search.</h3>
      <p className="text-sm text-tb-text-secondary mb-6 max-w-sm">
        We couldn&apos;t find any destinations matching your current filters. Try changing your filters to see more results.
      </p>
      <Link 
        href="/search" 
        className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary focus-visible:ring-offset-2 rounded-tb-md active:scale-[0.98] bg-tb-primary text-white hover:bg-tb-primary-hover shadow-tb-subtle border border-transparent h-10 px-4 py-2 text-sm"
      >
        Clear Filters
      </Link>
    </div>
  );
}
