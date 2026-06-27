import React from 'react';
import { CompaniesStats } from '@/components/admin/companies/CompaniesStats';
import { CompaniesFilters } from '@/components/admin/companies/CompaniesFilters';
import { CompaniesTable } from '@/components/admin/companies/CompaniesTable';

export const dynamic = "force-dynamic";

interface CompaniesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const sp = await searchParams;
  
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const status = typeof sp.status === 'string' ? sp.status : undefined;
  const verification = typeof sp.verification === 'string' ? sp.verification : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Companies Directory</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage partner trekking companies, verifications, and marketplace listings.</p>
      </div>

      <CompaniesStats />
      
      <div className="space-y-4">
        <CompaniesFilters />
        <CompaniesTable 
          searchQuery={q} 
          statusFilter={status}
          verificationFilter={verification}
          sortBy={sort} 
        />
      </div>
    </div>
  );
}
