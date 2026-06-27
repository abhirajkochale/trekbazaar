import React from 'react';
import { getCompanies } from '@/lib/admin/companies';
import { CompanyRow } from './CompanyRow';
import { AdminCard } from '../shared/AdminCard';

interface CompaniesTableProps {
  searchQuery?: string;
  statusFilter?: string;
  verificationFilter?: string;
  sortBy?: string;
}

export async function CompaniesTable({ 
  searchQuery, 
  statusFilter, 
  verificationFilter, 
  sortBy 
}: CompaniesTableProps) {
  const companies = await getCompanies(searchQuery, statusFilter, verificationFilter, sortBy);

  return (
    <AdminCard title="Companies Directory" noPadding>
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Verification</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-zinc-900">No companies found</p>
                    <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <CompanyRow key={company.id} company={company} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
