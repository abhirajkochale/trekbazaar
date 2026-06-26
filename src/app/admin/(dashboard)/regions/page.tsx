import React from 'react';
import { RegionStats } from '@/components/admin/regions/RegionStats';
import { RegionFilters } from '@/components/admin/regions/RegionFilters';
import { RegionsTable } from '@/components/admin/regions/RegionsTable';
import { CreateRegionButton } from '@/components/admin/regions/CreateRegionButton';

export const dynamic = "force-dynamic";

interface RegionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RegionsPage({ searchParams }: RegionsPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Regions Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage trekking destinations and region metadata.</p>
        </div>
        <CreateRegionButton />
      </div>

      <RegionStats />
      
      <div className="space-y-4">
        <RegionFilters />
        <RegionsTable searchQuery={q} sortBy={sort} />
      </div>
    </div>
  );
}
