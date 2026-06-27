import React from 'react';
import { getDepartureStats } from '@/lib/admin/departures';
import { StatCard } from '../shared/StatCard';
import { CalendarDays, PlaneTakeoff, Users, Percent } from 'lucide-react';

export async function DeparturesStats() {
  const stats = await getDepartureStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Departures" 
        value={stats.total} 
        icon={<CalendarDays className="w-5 h-5 text-zinc-600" />} 
      />
      <StatCard 
        title="Upcoming" 
        value={stats.upcoming} 
        icon={<PlaneTakeoff className="w-5 h-5 text-emerald-500" />} 
      />
      <StatCard 
        title="Seats Available" 
        value={stats.availableSeats} 
        icon={<Users className="w-5 h-5 text-blue-500" />} 
      />
      <StatCard 
        title="Occupancy" 
        value={`${stats.occupancy}%`} 
        icon={<Percent className="w-5 h-5 text-amber-500" />} 
      />
    </div>
  );
}
