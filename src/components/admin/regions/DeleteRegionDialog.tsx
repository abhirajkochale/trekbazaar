"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { removeRegion } from '@/app/admin/(dashboard)/regions/actions';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regionId: string;
  regionName: string;
  treksCount: number;
}

export function DeleteRegionDialog({ isOpen, onClose, regionId, regionName, treksCount }: DeleteRegionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await removeRegion(regionId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(`${regionName} has been deleted.`);
        onClose();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Region" maxWidth="sm">
      <div className="flex flex-col items-center text-center pb-6 pt-2">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Are you sure?</h3>
        
        {treksCount > 0 ? (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
            You cannot delete <strong>{regionName}</strong> because it has <strong>{treksCount}</strong> active treks assigned to it. Please reassign or delete those treks first.
          </p>
        ) : (
          <p className="text-sm text-zinc-500">
            This action cannot be undone. This will permanently delete the <strong>{regionName}</strong> region from the database.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-white border border-zinc-300 text-zinc-700 font-medium rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting || treksCount > 0}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete Region"}
        </button>
      </div>
    </Modal>
  );
}
