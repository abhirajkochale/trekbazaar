import React from 'react';
import { getCompanies } from '@/lib/admin/companies';
import Link from 'next/link';
import { ShieldCheck, Clock, XCircle, Building2, AlertCircle } from 'lucide-react';
import type { ApprovalStatus } from '@/lib/types';

export const dynamic = "force-dynamic";

const badgeMap: Record<ApprovalStatus, { icon: any, class: string }> = {
  approved: { icon: ShieldCheck, class: "bg-emerald-50 text-emerald-700" },
  pending: { icon: Clock, class: "bg-amber-50 text-amber-700" },
  changes_requested: { icon: AlertCircle, class: "bg-blue-50 text-blue-700" },
  rejected: { icon: XCircle, class: "bg-red-50 text-red-700" },
  suspended: { icon: XCircle, class: "bg-zinc-100 text-zinc-700" },
};

export default async function PartnerApplicationsPage() {
  // Fetch all companies. In a real app, you might want to paginate or filter here.
  const companies = await getCompanies();
  
  // Sort pending to top, then approved
  const sortedCompanies = [...companies].sort((a, b) => {
    if (a.approval_status === "pending" && b.approval_status !== "pending") return -1;
    if (a.approval_status !== "pending" && b.approval_status === "pending") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Partner Applications</h1>
        <p className="text-sm text-zinc-500 mt-1">Review new trekking company registrations and manage approvals.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {sortedCompanies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-medium">
                    No partner applications found.
                  </td>
                </tr>
              )}
              {sortedCompanies.map(company => {
                const Badge = badgeMap[company.approval_status as ApprovalStatus] || badgeMap.pending;
                return (
                  <tr key={company.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0">
                          {company.logo_url ? (
                            <img src={company.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Building2 className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{company.name}</div>
                          <div className="text-xs text-zinc-500">{company.city || "No City"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900">{company.contact_person || "N/A"}</div>
                      <div className="text-xs text-zinc-500">{company.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${Badge.class}`}>
                        <Badge.icon className="w-3.5 h-3.5" />
                        {company.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-medium">
                      {new Date(company.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link 
                        href={`/admin/partner-applications/${company.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-zinc-200 text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-50 transition-colors shadow-sm"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
