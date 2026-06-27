import React from 'react';

export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-zinc-200 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="h-6 w-2/3 bg-zinc-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse" />
        </div>
        
        <div className="h-4 w-1/3 bg-zinc-200 rounded animate-pulse" />
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-end">
          <div className="space-y-2 w-1/3">
            <div className="h-3 w-1/2 bg-zinc-200 rounded animate-pulse" />
            <div className="h-6 w-full bg-zinc-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-1/3 bg-zinc-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
