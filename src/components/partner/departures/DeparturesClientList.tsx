"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Calendar, ArrowDown, ArrowUp, Users, Copy, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Departure } from "@/lib/types";

interface Props {
  departures: Departure[];
}

export function DeparturesClientList({ departures }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Departure | 'trek_name', direction: 'asc' | 'desc' } | null>({
    key: "departure_date",
    direction: "asc"
  });

  const handleSort = (key: keyof Departure | 'trek_name') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredDepartures = departures.filter(dep => 
    dep.treks?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dep.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDepartures = [...filteredDepartures].sort((a, b) => {
    if (!sortConfig) return 0;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortConfig.key as keyof Departure];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortConfig.key as keyof Departure];

    if (sortConfig.key === 'trek_name') {
      aValue = a.treks?.title;
      bValue = b.treks?.title;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Departures</h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium">Manage your schedule and capacity.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search departures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition-shadow outline-none shadow-sm"
            />
          </div>
          <Link href="/partner/departures/new" className="shrink-0">
            <Button variant="primary" className="gap-2 h-10 shadow-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Departure</span>
            </Button>
          </Link>
        </div>
      </div>

      {departures.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center py-24 px-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-6 shadow-sm">
            <Calendar className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No departures scheduled</h3>
          <p className="text-base text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
            Create dates for your treks so customers can start booking them. You can duplicate existing dates easily.
          </p>
          <Link href="/partner/departures/new">
            <Button variant="primary" className="gap-2 px-8 h-12 text-base shadow-sm active:scale-95 transition-transform">
              <Plus className="w-5 h-5" />
              Add Your First Departure
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-zinc-50/80 border-b border-zinc-200 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('departure_date')}>
                      <div className="flex items-center gap-2">Dates {sortConfig?.key === 'departure_date' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('trek_name')}>
                      <div className="flex items-center gap-2">Trek Name {sortConfig?.key === 'trek_name' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {sortedDepartures.map(dep => {
                    const occupancyPct = Math.min(100, Math.round((dep.booked_seats / dep.total_seats) * 100));
                    return (
                      <tr key={dep.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-zinc-500 uppercase leading-none mb-0.5">
                                  {new Date(dep.departure_date).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-lg font-black text-zinc-900 leading-none">
                                  {new Date(dep.departure_date).toLocaleDateString('en-US', { day: 'numeric' })}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-900">
                                  {new Date(dep.departure_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric' })}
                                </p>
                                <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                  to {new Date(dep.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/partner/treks/${dep.trek_id}/edit`} className="font-bold text-sm text-zinc-900 hover:text-tb-primary transition-colors">
                            {dep.treks?.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 w-32">
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span className="text-zinc-900">{dep.booked_seats} booked</span>
                              <span className="text-zinc-500">{dep.total_seats} total</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${occupancyPct >= 100 ? 'bg-red-500' : occupancyPct >= 80 ? 'bg-amber-500' : 'bg-tb-primary'}`}
                                style={{ width: `${occupancyPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            dep.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            dep.status === 'Full' ? 'bg-red-50 text-red-700 border-red-200' : 
                            dep.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-zinc-50 text-zinc-700 border-zinc-200'
                          }`}>
                            {dep.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/partner/departures/${dep.id}/edit`} className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-sm transition-all" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <Link href={`/partner/departures/new?duplicate=${dep.id}`} className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-sm transition-all" title="Duplicate">
                              <Copy className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedDepartures.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-zinc-500">
                        No departures found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {sortedDepartures.map(dep => {
               const occupancyPct = Math.min(100, Math.round((dep.booked_seats / dep.total_seats) * 100));
               return (
                <div key={dep.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-zinc-500 uppercase leading-none mb-0.5">
                          {new Date(dep.departure_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black text-zinc-900 leading-none">
                          {new Date(dep.departure_date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{dep.treks?.title}</h3>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">to {new Date(dep.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        dep.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        dep.status === 'Full' ? 'bg-red-50 text-red-700 border-red-200' : 
                        dep.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-zinc-50 text-zinc-700 border-zinc-200'
                      }`}>
                        {dep.status}
                    </span>
                  </div>
                  
                  <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-900 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-zinc-400" /> {dep.booked_seats} Booked</span>
                      <span className="text-zinc-500">{dep.total_seats} Total</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${occupancyPct >= 100 ? 'bg-red-500' : occupancyPct >= 80 ? 'bg-amber-500' : 'bg-tb-primary'}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Link href={`/partner/departures/${dep.id}/edit`} className="flex-1 text-center text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors">
                      Edit
                    </Link>
                    <Link href={`/partner/departures/new?duplicate=${dep.id}`} className="flex-1 text-center text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Duplicate
                    </Link>
                  </div>
                </div>
               );
            })}
            {sortedDepartures.length === 0 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-sm font-medium text-zinc-500 shadow-sm">
                No departures found matching your search.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
