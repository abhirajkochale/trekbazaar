import React from 'react';
import Link from 'next/link';
import { getRecentEnquiries } from '@/lib/admin/dashboard';
import { AdminCard } from '../shared/AdminCard';
import { Eye } from 'lucide-react';

const statusBadge: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  responded: "bg-blue-100 text-blue-800",
  closed: "bg-zinc-200 text-zinc-700",
};

export async function RecentEnquiries() {
  const enquiries = await getRecentEnquiries(5);

  return (
    <AdminCard 
      title="Recent Enquiries" 
      noPadding 
      action={
        <Link href="/admin/enquiries" className="text-sm text-tb-primary hover:underline font-medium">
          View all
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Trek</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No enquiries received yet.
                </td>
              </tr>
            ) : (
              enquiries.map((eq) => (
                <tr key={eq.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-medium text-zinc-900">{eq.name}</div>
                    <div className="text-xs text-zinc-500">{eq.email}</div>
                  </td>
                  <td className="px-6 py-3 text-zinc-700 truncate max-w-[200px]">
                    {eq.treks?.title || 'General Enquiry'}
                  </td>
                  <td className="px-6 py-3 text-zinc-700">
                    {new Date(eq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[eq.status] || "bg-zinc-200 text-zinc-700"}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/admin/enquiries/${eq.id}`}
                      className="inline-flex items-center justify-center p-1.5 text-zinc-400 hover:text-tb-primary hover:bg-tb-primary/10 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
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
