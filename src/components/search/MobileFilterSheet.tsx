"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebar } from './FilterSidebar';
import { Button } from '../ui/Button';

export function MobileFilterSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  // Close the sheet automatically when the URL changes (meaning a filter was applied)
  // Wait, if it closes on EVERY filter change, the user can only apply one filter at a time.
  // We should let them close it manually.

  // Count active filters
  const activeCount = Array.from(searchParams.keys()).filter(k => 
    ['region', 'difficulty', 'duration', 'minPrice', 'maxPrice'].includes(k)
  ).length;

  return (
    <div className="md:hidden">
      {/* Floating Action Button or Inline Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="mobile-filter-drawer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters {activeCount > 0 && <span className="bg-tb-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeCount}</span>}
        </Button>
      </div>

      {/* Slide-over Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div 
            id="mobile-filter-drawer"
            className="relative w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-label="Filters"
          >
            <div className="p-4 flex items-center justify-between border-b border-tb-border sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-tb-text-primary">Filters</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-tb-text-secondary hover:text-tb-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-tb-primary rounded-md"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 pb-24">
              {/* Reuse the desktop sidebar but strip its sticky positioning via wrapper classes */}
              <div className="[&>div]:border-none [&>div]:p-0 [&>div]:shadow-none [&>div>h3]:hidden">
                <FilterSidebar />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-tb-border">
              <Button variant="primary" className="w-full" onClick={() => setIsOpen(false)}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
