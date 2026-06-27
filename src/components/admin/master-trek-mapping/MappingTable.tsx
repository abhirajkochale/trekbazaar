"use client";

import React, { useState } from 'react';
import { AdminCard } from '../shared/AdminCard';
import { MappingRow } from './MappingRow';
import { Search } from 'lucide-react';

interface MappingTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unmappedTreks: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
}

export function MappingTable({ unmappedTreks, masterTreks }: MappingTableProps) {
  const [search, setSearch] = useState('');

  const filteredTreks = unmappedTreks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.companies?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminCard title="Unmapped Packages" noPadding>
      <div className="p-4 border-b border-zinc-200 bg-zinc-50">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-tb-primary focus:border-tb-primary sm:text-sm"
            placeholder="Search packages or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Package Name</th>
              <th className="px-6 py-4 font-medium">Region</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium w-80">Select Master Trek</th>
              <th className="px-6 py-4 font-medium text-right w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {filteredTreks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                  <p className="text-sm font-medium text-zinc-900">All caught up!</p>
                  <p className="text-xs text-zinc-500 mt-1">No unmapped packages match your search.</p>
                </td>
              </tr>
            ) : (
              filteredTreks.map((trek) => (
                <MappingRow key={trek.id} trek={trek} masterTreks={masterTreks} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
