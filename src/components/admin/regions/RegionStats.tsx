import React from 'react';
import { getRegionStats } from '@/lib/admin/regions';
import { StatCard } from '../shared/StatCard';
import { Map, MapPin, Mountain, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export async function RegionStats() {
  const stats = await getRegionStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Regions" 
        value={stats.totalRegions} 
        icon={<Map className="w-5 h-5" />} 
      />
      <StatCard 
        title="Active Regions" 
        value={stats.activeRegions} 
        icon={<MapPin className="w-5 h-5" />} 
      />
      <StatCard 
        title="Total Treks" 
        value={stats.totalTreks} 
        icon={<Mountain className="w-5 h-5" />} 
      />
      <StatCard 
        title="Avg. Trek Price" 
        value={formatPrice(stats.avgTrekPrice)} 
        icon={<DollarSign className="w-5 h-5" />} 
      />
    </div>
  );
}
