import React from 'react';
import { getCompanyStats } from '@/lib/admin/companies';
import { StatCard } from '../shared/StatCard';
import { Building2, ShieldCheck, Clock, Star } from 'lucide-react';

export async function CompaniesStats() {
  const stats = await getCompanyStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Companies" 
        value={stats.totalCompanies} 
        icon={<Building2 className="w-4 h-4 text-zinc-600" />} 
      />
      <StatCard 
        title="Verified" 
        value={stats.verifiedCompanies} 
        icon={<ShieldCheck className="w-4 h-4 text-zinc-500" />} 
      />
      <StatCard 
        title="Pending Approval" 
        value={stats.pendingCompanies} 
        icon={<Clock className="w-4 h-4 text-zinc-500" />} 
      />
      <StatCard 
        title="Featured Partners" 
        value={stats.featuredCompanies} 
        icon={<Star className="w-4 h-4 text-zinc-500" />} 
      />
    </div>
  );
}
