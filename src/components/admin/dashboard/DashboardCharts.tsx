import React from 'react';
import { AdminCard } from '../shared/AdminCard';
import { TreksByRegionChart } from '../charts/TreksByRegionChart';
import { DifficultyChart } from '../charts/DifficultyChart';
import { EnquiryTrendChart } from '../charts/EnquiryTrendChart';
import { 
  getTreksByRegion, 
  getDifficultyDistribution, 
  getEnquiryTrend 
} from '@/lib/admin/dashboard';

export async function DashboardCharts() {
  const [regionData, difficultyData, trendData] = await Promise.all([
    getTreksByRegion(),
    getDifficultyDistribution(),
    getEnquiryTrend(),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <AdminCard title="Enquiries Trend" className="lg:col-span-2">
        <EnquiryTrendChart data={trendData} />
      </AdminCard>
      
      <AdminCard title="Difficulty Distribution">
        <DifficultyChart data={difficultyData} />
      </AdminCard>
      
      <AdminCard title="Treks by Region" className="lg:col-span-3">
        <TreksByRegionChart data={regionData} />
      </AdminCard>
    </div>
  );
}
