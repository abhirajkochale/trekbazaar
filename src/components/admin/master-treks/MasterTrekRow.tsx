"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteMasterTrekDialog } from './DeleteMasterTrekDialog';
import type { MasterTrek, MasterTrekCategory, Region } from '@/lib/types';

interface MasterTrekJoined extends MasterTrek {
  category?: MasterTrekCategory;
  region?: Region;
  packages_count?: number;
}

export function MasterTrekRow({ masterTrek }: { masterTrek: MasterTrekJoined }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900">{masterTrek.name}</span>
            <span className="text-xs text-zinc-500">{masterTrek.slug}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-zinc-500">
          {masterTrek.category?.name || "Uncategorized"}
        </td>
        <td className="px-6 py-4 text-sm text-zinc-500">
          {masterTrek.region?.name || "-"}
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
            {masterTrek.packages_count || 0}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            masterTrek.status === 'active' 
              ? 'bg-green-50 text-green-700' 
              : masterTrek.status === 'archived'
                ? 'bg-red-50 text-red-700'
                : 'bg-zinc-100 text-zinc-700'
          }`}>
            {masterTrek.status.charAt(0).toUpperCase() + masterTrek.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link 
              href={`/admin/master-treks/${masterTrek.id}/edit`}
              className="p-1.5 text-zinc-400 hover:text-tb-primary hover:bg-tb-primary/10 rounded-md transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setIsDeleteOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <DeleteMasterTrekDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        id={masterTrek.id}
        name={masterTrek.name}
        packagesCount={masterTrek.packages_count || 0}
        status={masterTrek.status}
      />
    </>
  );
}
