import React from 'react';
import { SearchLayout } from '@/components/search/SearchLayout';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export default function SearchLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-tb-sys-background">
      <main className="flex-1 flex flex-col">
        <div className="bg-white border-b border-zinc-200 py-6">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
          </div>
        </div>
        <SearchLayout>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </SearchLayout>
      </main>
    </div>
  );
}
