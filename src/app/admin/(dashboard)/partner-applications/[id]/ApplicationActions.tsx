"use client";

import React, { useTransition } from 'react';
import { updateApplicationStatusAction } from './actions';
import type { ApprovalStatus } from '@/lib/types';
import toast from 'react-hot-toast';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export function ApplicationActions({ companyId, initialStatus }: { companyId: string, initialStatus: ApprovalStatus }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: ApprovalStatus) => {
    startTransition(async () => {
      const res = await updateApplicationStatusAction(companyId, status);
      if (res.success) {
        toast.success(`Application status updated to ${status}`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        disabled={isPending || initialStatus === "approved"}
        onClick={() => handleUpdate("approved")}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4" />
        Approve
      </button>

      <button
        disabled={isPending || initialStatus === "rejected"}
        onClick={() => handleUpdate("rejected")}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" />
        Reject
      </button>
      
      <button
        disabled={isPending || initialStatus === "changes_requested"}
        onClick={() => handleUpdate("changes_requested")}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <AlertCircle className="w-4 h-4" />
        Request Changes
      </button>
      
      <button
        disabled={isPending || initialStatus === "suspended"}
        onClick={() => handleUpdate("suspended")}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-white text-sm font-bold rounded-lg hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suspend Account
      </button>
    </div>
  );
}
