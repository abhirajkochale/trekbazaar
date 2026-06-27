"use client";

import React from 'react';
import { deleteCompanyAction } from '@/app/admin/(dashboard)/companies/actions';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';

interface DeleteCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

export function DeleteCompanyDialog({ isOpen, onClose, companyId, companyName }: DeleteCompanyDialogProps) {
  const handleDelete = async () => {
    const res = await deleteCompanyAction(companyId);
    if (!res.success) {
      toast.error(res.error || "Failed to delete company.");
      throw new Error(res.error || "Failed to delete company.");
    }
    toast.success(`"${companyName}" has been deleted.`);
  };

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Company"
      itemName={companyName}
      description="Any treks linked to this company will remain but will lose their company association."
    />
  );
}
