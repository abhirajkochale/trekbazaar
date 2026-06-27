"use client";

import React from 'react';
import { removeCategory } from '@/app/admin/(dashboard)/master-trek-categories/actions';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  treksCount: number;
}

export function DeleteCategoryDialog({ isOpen, onClose, categoryId, categoryName, treksCount }: DeleteCategoryDialogProps) {
  const handleDelete = async () => {
    const res = await removeCategory(categoryId);
    if (res?.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    toast.success(`${categoryName} has been deleted.`);
  };

  const isActionDisabled = treksCount > 0;
  
  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Category"
      itemName={categoryName}
      description="It will be removed from the database."
      isActionDisabled={isActionDisabled}
      disabledMessage={
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
          You cannot delete <strong>{categoryName}</strong> because it has <strong>{treksCount}</strong> Master Treks assigned to it. Please reassign or delete those Master Treks first.
        </p>
      }
    />
  );
}
