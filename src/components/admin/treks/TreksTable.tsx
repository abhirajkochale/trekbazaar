import React from 'react';
import { getTreks } from '@/lib/admin/treks';
import { TrekRow } from './TrekRow';
import { AdminCard } from '../shared/AdminCard';

interface TreksTableProps {
  searchQuery?: string;
  regionFilter?: string;
  difficultyFilter?: string;
  statusFilter?: string;
  sortBy?: string;
}

export async function TreksTable({ 
  searchQuery, 
  regionFilter, 
  difficultyFilter, 
  statusFilter, 
  sortBy 
}: TreksTableProps) {
  const treks = await getTreks(searchQuery, regionFilter, difficultyFilter, statusFilter, sortBy);

  return (
    <AdminCard title="Treks Directory" noPadding>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Trek</th>
              <th className="px-6 py-4 font-medium">Region</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {treks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-zinc-500">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-zinc-900">No treks found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              treks.map((trek) => (
                <TrekRow key={trek.id} trek={trek} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
