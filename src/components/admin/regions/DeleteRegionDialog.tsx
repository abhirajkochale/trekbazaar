"use client";

import React from 'react';
import { removeRegion } from '@/app/admin/(dashboard)/regions/actions';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';

interface DeleteRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regionId: string;
  regionName: string;
  treksCount: number;
}

export function DeleteRegionDialog({ isOpen, onClose, regionId, regionName, treksCount }: DeleteRegionDialogProps) {
  const handleDelete = async () => {
    const res = await removeRegion(regionId);
    if (res?.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    toast.success(`${regionName} has been deleted.`);
  };

  const isActionDisabled = treksCount > 0;
  
  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Region"
      itemName={regionName}
      description="It will be removed from the database."
      isActionDisabled={isActionDisabled}
      disabledMessage={
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
          You cannot delete <strong>{regionName}</strong> because it has <strong>{treksCount}</strong> active treks assigned to it. Please reassign or delete those treks first.
        </p>
      }
    />
  );
}
