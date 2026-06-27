import React from 'react';
import { getMasterTreks } from '@/lib/admin/master-treks';
import { MasterTrekRow } from './MasterTrekRow';
import { AdminCard } from '../shared/AdminCard';

interface MasterTreksTableProps {
  searchQuery?: string;
  sortBy?: string;
}

export async function MasterTreksTable({ searchQuery, sortBy }: MasterTreksTableProps) {
  const masterTreks = await getMasterTreks(searchQuery, sortBy);

  return (
    <AdminCard title="All Master Treks" noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Master Trek</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Region</th>
              <th className="px-6 py-4 font-medium">Packages</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {masterTreks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  {searchQuery ? "No master treks found matching your search." : "No master treks created yet."}
                </td>
              </tr>
            ) : (
              masterTreks.map((masterTrek) => (
                <MasterTrekRow key={masterTrek.id} masterTrek={masterTrek} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
