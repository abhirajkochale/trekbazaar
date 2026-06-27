import React from 'react';
import { getMasterTreksStats } from '@/lib/admin/master-treks';
import { StatCard } from '../shared/StatCard';
import { Map, CheckCircle, Link as LinkIcon } from 'lucide-react';

export async function MasterTreksStats() {
  const stats = await getMasterTreksStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Master Treks" 
        value={stats.total} 
        icon={<Map className="w-5 h-5" />} 
      />
      <StatCard 
        title="Active Master Treks" 
        value={stats.active} 
        icon={<CheckCircle className="w-5 h-5" />} 
      />
      <StatCard 
        title="Linked Company Packages" 
        value={stats.linkedPackages} 
        icon={<LinkIcon className="w-5 h-5" />} 
      />
    </div>
  );
}
