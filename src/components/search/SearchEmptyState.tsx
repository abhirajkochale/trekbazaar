import React from 'react';
import Link from 'next/link';

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white border border-zinc-200 rounded-2xl shadow-sm h-full">
      <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8 border border-zinc-100">
        <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">No results found</h3>
      <p className="text-base text-zinc-500 mb-8 max-w-sm font-medium leading-relaxed">
        We couldn&apos;t find any destinations matching your exact filters. Try broadening your search or adjusting your preferences.
      </p>
      <Link 
        href="/search" 
        className="inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-full active:scale-95 bg-zinc-900 text-white hover:bg-black shadow-md h-12 px-8 text-base"
      >
        Clear all filters
      </Link>
    </div>
  );
}
