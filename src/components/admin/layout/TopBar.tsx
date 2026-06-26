"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { MobileSidebar } from './MobileSidebar';
import { Search, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function TopBar() {
  const pathname = usePathname();
  
  // Very simple breadcrumb derivation from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.length > 1 
    ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
    : 'Dashboard';

  return (
    <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        
        <div className="hidden sm:flex flex-col">
          <h2 className="text-sm font-bold text-zinc-900">{breadcrumb}</h2>
          <div className="text-xs text-zinc-500 flex items-center gap-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-zinc-900">{breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Search Input */}
        <div className="hidden md:flex relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-zinc-200 rounded-md leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm transition-colors"
            placeholder="Search treks, regions, enquiries..."
          />
        </div>

        <Link 
          href="/"
          target="_blank"
          className="text-zinc-500 hover:text-zinc-900 hidden sm:flex items-center gap-1 text-sm font-medium transition-colors"
          title="View public website"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden md:inline">Website</span>
        </Link>

        <button className="text-zinc-500 hover:text-zinc-900 relative p-1 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="w-8 h-8 rounded-full bg-zinc-200 sm:hidden flex items-center justify-center text-sm font-bold text-zinc-600">
          A
        </div>
      </div>
    </header>
  );
}
