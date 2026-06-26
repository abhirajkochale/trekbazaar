import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-tb-md border border-tb-border bg-white shadow-tb-subtle animate-pulse">
          <div className="aspect-[16/10] w-full bg-tb-sys-background" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex justify-between gap-2">
              <div className="h-5 bg-tb-sys-background rounded w-2/3" />
              <div className="h-5 bg-tb-sys-background rounded-full w-16" />
            </div>
            <div className="h-4 bg-tb-sys-background rounded w-1/3" />
            <div className="mt-auto pt-2 flex justify-between items-end">
              <div className="h-4 bg-tb-sys-background rounded w-1/4" />
              <div className="flex flex-col items-end gap-1">
                <div className="h-5 bg-tb-sys-background rounded w-20" />
                <div className="h-3 bg-tb-sys-background rounded w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
