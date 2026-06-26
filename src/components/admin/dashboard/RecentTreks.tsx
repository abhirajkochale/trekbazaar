/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { getRecentTreks } from '@/lib/admin/dashboard';
import { AdminCard } from '../shared/AdminCard';
import { formatPrice } from '@/lib/format';
import { Edit2 } from 'lucide-react';

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-zinc-200 text-zinc-700",
  archived: "bg-amber-100 text-amber-800",
};

export async function RecentTreks() {
  const treks = await getRecentTreks(5);

  return (
    <AdminCard 
      title="Recently Added Treks" 
      noPadding
      action={
        <Link href="/admin/treks" className="text-sm text-tb-primary hover:underline font-medium">
          View all
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {treks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No treks created yet.
                </td>
              </tr>
            ) : (
              treks.map((trek) => (
                <tr key={trek.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-zinc-200 overflow-hidden flex-shrink-0 relative">
                        {trek.cover_image_url ? (
                          <img 
                            src={trek.cover_image_url} 
                            alt={trek.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">NA</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{trek.title}</div>
                        <div className="text-xs text-zinc-500">/{trek.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-zinc-700">
                    {trek.region}
                  </td>
                  <td className="px-6 py-3 text-zinc-700">
                    {formatPrice(trek.price_per_person)}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[trek.status] || "bg-zinc-200 text-zinc-700"}`}>
                      {trek.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/admin/treks/${trek.id}/edit`}
                      className="inline-flex items-center justify-center p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Edit Trek"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
