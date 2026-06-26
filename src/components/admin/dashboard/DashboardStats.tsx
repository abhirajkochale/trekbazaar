import React from 'react';
import { StatCard } from '../shared/StatCard';
import { getDashboardStats } from '@/lib/admin/dashboard';
import { Mountain, Map, MessageSquare, Clock, DollarSign, Activity } from 'lucide-react';
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
        title="Total Enquiries" 
        value={stats.totalEnquiries} 
        icon={<MessageSquare className="w-5 h-5" />} 
      />
      <StatCard 
        title="Pending Enquiries" 
        value={stats.pendingEnquiries} 
        icon={<Activity className="w-5 h-5 text-red-500" />} 
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
