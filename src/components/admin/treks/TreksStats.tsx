import React from 'react';
import { getTrekStats } from '@/lib/admin/treks';
import { StatCard } from '../shared/StatCard';
import { Mountain, CheckCircle, FileEdit, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export async function TreksStats() {
  const stats = await getTrekStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Treks" 
        value={stats.totalTreks} 
        icon={<Mountain className="w-5 h-5" />} 
      />
      <StatCard 
        title="Active" 
        value={stats.activeTreks} 
        icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
      />
      <StatCard 
        title="Drafts" 
        value={stats.draftTreks} 
        icon={<FileEdit className="w-5 h-5 text-zinc-500" />} 
      />
      <StatCard 
        title="Avg. Price" 
        value={formatPrice(stats.avgPrice)} 
        icon={<DollarSign className="w-5 h-5" />} 
      />
    </div>
  );
}
