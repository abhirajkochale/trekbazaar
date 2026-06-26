import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-tb-border rounded-tb-md">
      <div className="w-24 h-24 bg-tb-sys-background rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-tb-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-tb-text-primary mb-2">No treks found</h3>
      <p className="text-sm text-tb-text-secondary mb-6 max-w-sm">
        We couldn&apos;t find any treks matching your current filters. Try changing your filters to see more results.
      </p>
      <Link href="/search" passHref legacyBehavior>
        <Button variant="primary">Clear Filters</Button>
      </Link>
    </div>
  );
}
