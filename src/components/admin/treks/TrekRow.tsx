"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useTransition } from 'react';
import type { Trek } from '@/lib/types';
import { ExternalLink, Edit2, Trash2, Copy, Globe, EyeOff, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { DeleteTrekDialog } from './DeleteTrekDialog';
import { formatPrice } from '@/lib/format';
import { duplicateTrekAction, togglePublishAction } from '@/app/admin/(dashboard)/treks/actions';
import toast from 'react-hot-toast';

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  draft: "bg-zinc-200 text-zinc-700 border-zinc-300",
  archived: "bg-amber-100 text-amber-800 border-amber-200",
};

const diffBadge: Record<string, string> = {
  easy: "bg-green-50 text-green-700",
  moderate: "bg-blue-50 text-blue-700",
  difficult: "bg-orange-50 text-orange-700",
  extreme: "bg-red-50 text-red-700",
};

export function TrekRow({ trek }: { trek: Trek }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDuplicate = () => {
    startTransition(async () => {
      const res = await duplicateTrekAction(trek.id);
      if (res.success) {
        toast.success("Trek duplicated successfully!");
      } else {
        toast.error(res.error || "Failed to duplicate.");
      }
    });
  };

  const handleToggleStatus = () => {
    startTransition(async () => {
      const res = await togglePublishAction(trek.id, trek.status);
      if (res.success) {
        toast.success(trek.status === 'active' ? "Trek unpublished." : "Trek published!");
      } else {
        toast.error(res.error || "Failed to update status.");
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-zinc-200 overflow-hidden flex-shrink-0 relative border border-zinc-200">
              {trek.cover_image_url ? (
                <img 
                  src={trek.cover_image_url} 
                  alt={trek.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">NA</div>
              )}
            </div>
            <div>
              <Link href={`/admin/treks/${trek.id}/edit`} className="font-semibold text-zinc-900 hover:text-tb-primary hover:underline">
                {trek.title}
              </Link>
              <div className="text-xs text-zinc-500">/{trek.slug}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
          {trek.master_treks?.name ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {trek.master_treks.name}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-500">
              Unlinked
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
          {trek.region}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${diffBadge[trek.difficulty] || "bg-zinc-100 text-zinc-700"}`}>
            {trek.difficulty}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
          {trek.duration_days} days
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
          {formatPrice(trek.price_per_person)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusBadge[trek.status] || "bg-zinc-200 text-zinc-700"}`}>
            {trek.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
          
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/treks/${trek.slug}`}
              target="_blank"
              className="p-1.5 text-zinc-400 hover:text-tb-primary hover:bg-tb-primary/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            
            <Link
              href={`/admin/treks/${trek.id}/edit`}
              className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            
            {/* Action Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
                className={`p-1.5 rounded-md transition-colors ${menuOpen ? 'text-zinc-900 bg-zinc-200' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleToggleStatus}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    {trek.status === 'active' ? (
                      <><EyeOff className="w-4 h-4 text-zinc-500" /> Unpublish</>
                    ) : (
                      <><Globe className="w-4 h-4 text-zinc-500" /> Publish</>
                    )}
                  </button>
                  <button
                    onClick={handleDuplicate}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-zinc-500" /> Duplicate
                  </button>
                  <div className="h-px bg-zinc-200 my-1"></div>
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

      <DeleteTrekDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        trekId={trek.id}
        trekTitle={trek.title}
      />
    </>
  );
}
