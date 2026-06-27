import React from 'react';
import { StatCard } from '../shared/StatCard';
import { Mountain, Layers, Link2, Unplug, CheckCircle2 } from 'lucide-react';
import type { MappingStats } from '@/lib/admin/mapping';

export function MappingStatsCards({ stats }: { stats: MappingStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard 
        title="Master Treks" 
        value={stats.totalMasterTreks} 
        icon={<Mountain className="w-5 h-5" />} 
      />
      <StatCard 
        title="Company Packages" 
        value={stats.totalCompanyPackages} 
        icon={<Layers className="w-5 h-5" />} 
      />
      <StatCard 
        title="Mapped Packages" 
        value={stats.mappedPackages} 
        icon={<Link2 className="w-5 h-5" />} 
      />
      <StatCard 
        title="Unmapped Packages" 
        value={stats.unmappedPackages} 
        icon={<Unplug className="w-5 h-5" />} 
      />
      <StatCard 
        title="Completion" 
        value={`${stats.completionPercentage}%`} 
        icon={<CheckCircle2 className="w-5 h-5" />} 
      />
    </div>
  );
}
