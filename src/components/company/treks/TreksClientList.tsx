"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Map, ChevronDown, ChevronUp, Copy, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Trek } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface Props {
  treks: Trek[];
}

export function TreksClientList({ treks }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Trek | 'price', direction: 'asc' | 'desc' } | null>({
    key: "updated_at",
    direction: "desc"
  });

  const handleSort = (key: keyof Trek | 'price') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTreks = treks.filter(trek => 
    trek.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (trek.region && trek.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedTreks = [...filteredTreks].sort((a, b) => {
    if (!sortConfig) return 0;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortConfig.key as keyof Trek];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortConfig.key as keyof Trek];

    if (sortConfig.key === 'price') {
      aValue = a.price_per_person;
      bValue = b.price_per_person;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Treks</h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium">Manage your catalog of adventures.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search treks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition-shadow outline-none shadow-sm"
            />
          </div>
          <Link href="/company/treks/new" className="shrink-0">
            <Button variant="primary" className="gap-2 h-10 shadow-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Trek</span>
            </Button>
          </Link>
        </div>
      </div>

      {treks.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center py-24 px-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-6 shadow-sm">
            <Map className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No treks in your catalog</h3>
          <p className="text-base text-zinc-500 mb-8 max-w-md mx-auto leading-relaxed">
            Get started by creating your first trek listing. You can add pricing, itineraries, and gorgeous photos to attract bookings.
          </p>
          <Link href="/company/treks/new">
            <Button variant="primary" className="gap-2 px-8 h-12 text-base shadow-sm active:scale-95 transition-transform">
              <Plus className="w-5 h-5" />
              Create Your First Trek
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-zinc-50/80 border-b border-zinc-200 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-2">Trek {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('region')}>
                      <div className="flex items-center gap-2">Region {sortConfig?.key === 'region' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-2">Price {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {sortedTreks.map(trek => (
                    <tr key={trek.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                            {trek.cover_image_url ? (
                              <Image src={trek.cover_image_url} alt={trek.title} fill className="object-cover" sizes="48px" />
                            ) : (
                              <Map className="w-5 h-5 text-zinc-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <div>
                            <Link href={`/company/treks/${trek.id}/edit`} className="font-bold text-sm text-zinc-900 hover:text-tb-primary transition-colors line-clamp-1">
                              {trek.title}
                            </Link>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">{trek.duration_days} days</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-600">{trek.region || '-'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-zinc-900">{formatPrice(trek.price_per_person)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          trek.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          trek.status === 'draft' ? 'bg-zinc-50 text-zinc-700 border-zinc-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {trek.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/company/treks/${trek.id}/edit`} className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-sm transition-all" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-sm transition-all" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedTreks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-zinc-500">
                        No treks found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {sortedTreks.map(trek => (
              <div key={trek.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex gap-4">
                 <div className="w-20 h-20 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                  {trek.cover_image_url ? (
                    <Image src={trek.cover_image_url} alt={trek.title} fill className="object-cover" sizes="80px" />
                  ) : (
                    <Map className="w-6 h-6 text-zinc-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{trek.title}</h3>
                    <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        trek.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        trek.status === 'draft' ? 'bg-zinc-50 text-zinc-700 border-zinc-200' : 
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {trek.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mb-2">{trek.region || 'No region'} • {trek.duration_days} days</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-zinc-900 text-sm">{formatPrice(trek.price_per_person)}</span>
                    <Link href={`/company/treks/${trek.id}/edit`} className="text-xs font-bold text-tb-primary bg-tb-primary/10 px-3 py-1.5 rounded-lg">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
             {sortedTreks.length === 0 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-sm font-medium text-zinc-500 shadow-sm">
                No treks found matching your search.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
