import React from 'react';
import { TreksStats } from '@/components/admin/treks/TreksStats';
import { TreksFilters } from '@/components/admin/treks/TreksFilters';
import { TreksTable } from '@/components/admin/treks/TreksTable';

export const dynamic = "force-dynamic";

interface TreksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TreksPage({ searchParams }: TreksPageProps) {
  const sp = await searchParams;
  
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const region = typeof sp.region === 'string' ? sp.region : undefined;
  const difficulty = typeof sp.difficulty === 'string' ? sp.difficulty : undefined;
  const status = typeof sp.status === 'string' ? sp.status : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Treks CMS</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage all trekking packages, itineraries, and SEO configurations.</p>
      </div>

      <TreksStats />
      
      <div className="space-y-4">
        <TreksFilters />
        <TreksTable 
          searchQuery={q} 
          regionFilter={region} 
          difficultyFilter={difficulty} 
          statusFilter={status}
          sortBy={sort} 
        />
      </div>
    </div>
  );
}
