"use client";

import React, { useState } from 'react';
import type { Departure } from '@/lib/types';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { DeleteDepartureDialog } from './DeleteDepartureDialog';
import { formatPrice } from '@/lib/format';

const statusBadge: Record<string, string> = {
  Upcoming: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Full: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function DepartureRow({ departure }: { departure: Departure }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cast for typescript to safely access nested relation
  const trekName = departure.treks?.title || 'Unknown Trek';
  const companyName = departure.treks?.companies?.name || 'TrekBazaar (Internal)';

  const dDate = new Date(departure.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const rDate = new Date(departure.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const effectivePrice = departure.offer_price ?? departure.base_price;

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-semibold text-zinc-900">{dDate}</div>
          <div className="text-xs text-zinc-500">to {rDate}</div>
        </td>
        <td className="px-6 py-4">
          <div className="font-medium text-zinc-900 truncate max-w-[200px]" title={trekName}>{trekName}</div>
          <div className="text-xs text-zinc-500 truncate max-w-[200px]" title={companyName}>{companyName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-tb-primary">{formatPrice(effectivePrice)}</div>
          {departure.offer_price != null && (
            <div className="text-xs text-zinc-400 line-through">{formatPrice(departure.base_price)}</div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-zinc-900">
            {departure.booked_seats} / {departure.total_seats}
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-tb-primary h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, (departure.booked_seats / departure.total_seats) * 100)}%` }}
            />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge[departure.status] || statusBadge.Completed}`}>
            {departure.status}
          </span>
          {!departure.is_active && (
            <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
              Hidden
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/admin/departures/${departure.id}/edit`}
              className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
                className={`p-1.5 rounded-md transition-colors ${menuOpen ? 'text-zinc-900 bg-zinc-200' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>

      <DeleteDepartureDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        departureId={departure.id}
      />
    </>
  );
}
