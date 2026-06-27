import React from 'react';
import { StatCard } from '../shared/StatCard';
import { getDashboardStats } from '@/lib/admin/dashboard';
import { Mountain, Map, Clock, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard 
        title="Total Treks" 
        value={stats.totalTreks} 
        icon={<Mountain className="w-5 h-5" />} 
      />
      <StatCard 
        title="Active Regions" 
        value={stats.activeRegions} 
        icon={<Map className="w-5 h-5" />} 
      />
      <StatCard 
        title="Avg. Trek Price" 
        value={formatPrice(stats.avgTrekPrice)} 
        icon={<DollarSign className="w-5 h-5" />} 
      />
      <StatCard 
        title="Avg. Duration" 
        value={`${stats.avgTrekDuration} days`} 
        icon={<Clock className="w-5 h-5" />} 
      />
    </div>
  );
}
