"use client";

import React, { useState, useTransition } from 'react';
import { SearchableMasterTrekSelect } from '../shared/SearchableMasterTrekSelect';
import { mapPackageAction } from '@/app/admin/(dashboard)/master-trek-mapping/actions';
import toast from 'react-hot-toast';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trek: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks: any[];
}

export function MappingRow({ trek, masterTreks }: Props) {
  const [selectedMasterTrekId, setSelectedMasterTrekId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!selectedMasterTrekId) {
      toast.error("Please select a Master Trek first.");
      return;
    }

    startTransition(async () => {
      const res = await mapPackageAction(trek.id, selectedMasterTrekId);
      if (res.success) {
        toast.success("Package mapped successfully!");
        // The row will automatically unmount because revalidatePath will fetch updated data where master_trek_id is not null
      } else {
        toast.error(res.error || "Failed to map package.");
      }
    });
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    draft: "bg-zinc-200 text-zinc-700",
    archived: "bg-amber-100 text-amber-800",
  };

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
        {trek.companies?.name || 'Unknown Company'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-zinc-900">{trek.title}</div>
        <div className="text-xs text-zinc-500">/{trek.slug}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
        {trek.region || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[trek.status] || "bg-zinc-100 text-zinc-700"}`}>
          {trek.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="w-full relative">
          <SearchableMasterTrekSelect 
            value={selectedMasterTrekId}
            onChange={setSelectedMasterTrekId}
            masterTreks={masterTreks}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          onClick={handleSave}
          disabled={!selectedMasterTrekId || isPending}
          className="px-3 py-1.5 bg-tb-primary text-white text-sm font-medium rounded-md hover:bg-tb-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  );
}
