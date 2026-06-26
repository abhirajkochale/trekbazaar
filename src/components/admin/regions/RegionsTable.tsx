import React from 'react';
import { getRegions } from '@/lib/admin/regions';
import { RegionRow } from './RegionRow';
import { AdminCard } from '../shared/AdminCard';

interface RegionsTableProps {
  searchQuery?: string;
  sortBy?: string;
}

export async function RegionsTable({ searchQuery, sortBy }: RegionsTableProps) {
  const regions = await getRegions(searchQuery, sortBy);

  return (
    <AdminCard title="All Regions" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Region</th>
              <th className="px-6 py-4 font-medium">Treks</th>
              <th className="px-6 py-4 font-medium">Best Season</th>
              <th className="px-6 py-4 font-medium">Altitude</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {regions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  {searchQuery ? "No regions found matching your search." : "No regions created yet."}
                </td>
              </tr>
            ) : (
              regions.map((region) => (
                <RegionRow key={region.id} region={region} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
