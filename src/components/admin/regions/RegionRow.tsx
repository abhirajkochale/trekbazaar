"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import type { RegionWithStats } from '@/lib/admin/regions';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { RegionForm } from './RegionForm';
import { DeleteRegionDialog } from './DeleteRegionDialog';

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  draft: "bg-zinc-200 text-zinc-700",
};

export function RegionRow({ region }: { region: RegionWithStats }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-zinc-200 overflow-hidden flex-shrink-0 relative">
              {region.hero_image_url ? (
                <img 
                  src={region.hero_image_url} 
                  alt={region.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">NA</div>
              )}
            </div>
            <div>
              <div className="font-semibold text-zinc-900">{region.name}</div>
              <div className="text-xs text-zinc-500">/{region.slug}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-medium text-zinc-900">{region.treks_count}</span>
          <span className="text-zinc-500 text-xs ml-1">treks</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
          {region.best_season || <span className="text-zinc-400">—</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
          {region.altitude_range || <span className="text-zinc-400">—</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[region.status] || "bg-zinc-200 text-zinc-700"}`}>
            {region.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/regions/${region.slug}`}
              target="_blank"
              className="p-1.5 text-zinc-400 hover:text-tb-primary hover:bg-tb-primary/10 rounded-md transition-colors"
              title="View Public Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Region"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Region"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <RegionForm 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        region={region} 
      />
      <DeleteRegionDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        regionId={region.id}
        regionName={region.name}
        treksCount={region.treks_count}
      />
    </>
  );
}
