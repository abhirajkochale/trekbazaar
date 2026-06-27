import React from "react";
import { getCompanyEnquiries } from "@/lib/company/enquiries";

export default async function CompanyEnquiriesPage() {
  const enquiries = await getCompanyEnquiries();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Enquiries</h1>
          <p className="text-zinc-500 mt-1">Manage customer questions for your treks.</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Trek</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {enquiries.map(enq => (
              <tr key={enq.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 text-sm text-zinc-500">
                  {new Date(enq.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900">{enq.name}</div>
                  <div className="text-xs text-zinc-500">{enq.email}</div>
                  {enq.phone && <div className="text-xs text-zinc-500">{enq.phone}</div>}
                </td>
                <td className="px-6 py-4 text-zinc-600 font-medium">
                  {enq.treks?.title}
                </td>
                <td className="px-6 py-4 text-zinc-600 text-sm max-w-xs truncate">
                  {enq.message}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    enq.status === 'open' ? 'bg-amber-100 text-amber-800' : 
                    enq.status === 'responded' ? 'bg-blue-100 text-blue-800' : 
                    'bg-zinc-100 text-zinc-800'
                  }`}>
                    {enq.status}
                  </span>
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
