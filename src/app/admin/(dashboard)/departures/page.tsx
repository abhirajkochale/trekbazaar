import React from 'react';
import { DeparturesStats } from '@/components/admin/departures/DeparturesStats';
import { DeparturesFilters } from '@/components/admin/departures/DeparturesFilters';
import { DeparturesTable } from '@/components/admin/departures/DeparturesTable';

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DeparturesPage({ searchParams }: Props) {
  const sp = await searchParams;
  
  const status = typeof sp.status === 'string' ? sp.status : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Departures Directory</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage scheduled trek departures, availability, and dynamic pricing.</p>
      </div>

      <DeparturesStats />
      
      <div className="space-y-4">
        <DeparturesFilters />
        <DeparturesTable 
          statusFilter={status}
          sortBy={sort} 
        />
      </div>
    </div>
  );
}
