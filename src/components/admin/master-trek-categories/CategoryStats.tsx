import React from 'react';
import { getCategoryStats } from '@/lib/admin/categories';
import { StatCard } from '../shared/StatCard';
import { LayoutList, Map, CheckCircle } from 'lucide-react';

export async function CategoryStats() {
  const stats = await getCategoryStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Categories" 
        value={stats.totalCategories} 
        icon={<LayoutList className="w-5 h-5" />} 
      />
      <StatCard 
        title="Active Categories" 
        value={stats.activeCategories} 
        icon={<CheckCircle className="w-5 h-5" />} 
      />
      <StatCard 
        title="Total Master Treks" 
        value={stats.totalMasterTreks} 
        icon={<Map className="w-5 h-5" />} 
      />
    </div>
  );
}
