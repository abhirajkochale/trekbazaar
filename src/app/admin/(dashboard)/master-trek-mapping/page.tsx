import React from 'react';
import { getMappingStats, getUnmappedTreks, getActiveMasterTreksForMapping } from '@/lib/admin/mapping';
import { MappingStatsCards } from '@/components/admin/master-trek-mapping/MappingStatsCards';
import { MappingTable } from '@/components/admin/master-trek-mapping/MappingTable';

export const dynamic = "force-dynamic";

export default async function MasterTrekMappingPage() {
  const [stats, unmappedTreks, masterTreks] = await Promise.all([
    getMappingStats(),
    getUnmappedTreks(),
    getActiveMasterTreksForMapping()
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Master Trek Mapping</h1>
        <p className="text-sm text-zinc-500 mt-1">Manually associate legacy unlinked company packages to canonical Master Treks.</p>
      </div>

      <MappingStatsCards stats={stats} />
      
      <MappingTable unmappedTreks={unmappedTreks} masterTreks={masterTreks} />
    </div>
  );
}
