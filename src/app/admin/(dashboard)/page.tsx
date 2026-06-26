import React from 'react';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/admin/dashboard/DashboardCharts';
import { RecentEnquiries } from '@/components/admin/dashboard/RecentEnquiries';
import { RecentTreks } from '@/components/admin/dashboard/RecentTreks';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back, Admin</h1>
        <p className="text-sm text-zinc-500 mt-1">Here is what&apos;s happening with TrekBazaar today.</p>
      </div>

      {/* Top Level Stats */}
      <DashboardStats />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Grid Layout for Recent Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentEnquiries />
          <RecentTreks />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
