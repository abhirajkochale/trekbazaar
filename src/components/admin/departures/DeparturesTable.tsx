import React from 'react';
import { getDepartures } from '@/lib/admin/departures';
import { DepartureRow } from './DepartureRow';
import { AdminCard } from '../shared/AdminCard';

interface Props {
  statusFilter?: string;
  sortBy?: string;
}

export async function DeparturesTable({ statusFilter, sortBy }: Props) {
  const departures = await getDepartures('all', 'all', statusFilter, sortBy);

  return (
    <AdminCard title="Departures Directory" noPadding>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Trek & Company</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Occupancy</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {departures.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-zinc-900">No departures found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or create a new schedule.</p>
                  </div>
                </td>
              </tr>
            ) : (
              departures.map((departure) => (
                <DepartureRow key={departure.id} departure={departure} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
