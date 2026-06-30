import React from 'react';
import { getPublicCompanies } from '@/lib/public/companies';
import { CompanyCard } from './CompanyCard';
import { SearchX } from 'lucide-react';

interface CompanyGridProps {
  searchParams: Record<string, string>;
}

export async function CompanyGrid({ searchParams }: CompanyGridProps) {
  const companies = await getPublicCompanies({
    q: searchParams.q,
    state: searchParams.state,
    region: searchParams.region,
    activity: searchParams.activity,
    sortBy: searchParams.sort,
  });

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-zinc-100 shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <SearchX className="w-4 h-4 text-zinc-300" />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-2">No partners found</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          We couldn't find any trekking companies matching your exact filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <p className="text-zinc-600 font-medium">
          Showing <span className="font-bold text-zinc-900">{companies.length}</span> verified partners
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
