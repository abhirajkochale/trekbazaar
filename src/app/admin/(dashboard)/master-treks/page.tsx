import React from 'react';
import { MasterTreksStats } from '@/components/admin/master-treks/MasterTreksStats';
import { MasterTreksFilters } from '@/components/admin/master-treks/MasterTreksFilters';
import { MasterTreksTable } from '@/components/admin/master-treks/MasterTreksTable';
import { CreateMasterTrekButton } from '@/components/admin/master-treks/CreateMasterTrekButton';

export const dynamic = "force-dynamic";

interface MasterTreksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MasterTreksPage({ searchParams }: MasterTreksPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Master Treks</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage canonical trekking destinations and routes.</p>
        </div>
        <CreateMasterTrekButton />
      </div>

      <MasterTreksStats />
      
      <div className="space-y-4">
        <MasterTreksFilters />
        <MasterTreksTable searchQuery={q} sortBy={sort} />
      </div>
    </div>
  );
}
