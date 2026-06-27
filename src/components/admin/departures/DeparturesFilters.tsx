"use client";

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function DeparturesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
            <select
              defaultValue={searchParams.get('status') || 'all'}
              onChange={(e) => updateParams('status', e.target.value)}
              className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
            >
              <option value="all">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Full">Full</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Sort By</label>
            <select
              defaultValue={searchParams.get('sort') || 'date_asc'}
              onChange={(e) => updateParams('sort', e.target.value)}
              className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
            >
              <option value="date_asc">Departure Date (Earliest)</option>
              <option value="date_desc">Departure Date (Latest)</option>
              <option value="price_asc">Price (Low to High)</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-end self-end h-full mt-5">
          <Link 
            href="/admin/departures/new"
            className="flex items-center gap-2 px-4 py-2 bg-tb-primary text-white text-sm font-semibold rounded-lg hover:bg-tb-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            New Departure
          </Link>
        </div>
      </div>
    </div>
  );
}
