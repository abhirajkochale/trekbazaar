"use client";

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function TreksFilters() {
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
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => updateParams('q', e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-tb-primary focus:border-tb-primary sm:text-sm transition-colors"
            placeholder="Search by title or slug..."
          />
        </div>
        
        <Link 
          href="/admin/treks/new"
          className="flex items-center gap-2 px-4 py-2 bg-tb-primary text-white text-sm font-semibold rounded-lg hover:bg-tb-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          New Trek
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
          <select
            defaultValue={searchParams.get('status') || 'all'}
            onChange={(e) => updateParams('status', e.target.value)}
            className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Difficulty</label>
          <select
            defaultValue={searchParams.get('difficulty') || 'all'}
            onChange={(e) => updateParams('difficulty', e.target.value)}
            className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Region</label>
          <select
            defaultValue={searchParams.get('region') || 'all'}
            onChange={(e) => updateParams('region', e.target.value)}
            className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
          >
            <option value="all">All Regions</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Sikkim">Sikkim</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Sort By</label>
          <select
            defaultValue={searchParams.get('sort') || 'updated_desc'}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="block w-full py-1.5 pl-3 pr-8 border border-zinc-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary"
          >
            <option value="updated_desc">Recently Updated</option>
            <option value="created_desc">Recently Created</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="duration_asc">Duration: Shortest</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
