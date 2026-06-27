"use client";

import React from 'react';
import { removeTrekAction } from '@/app/admin/(dashboard)/treks/actions';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';

interface DeleteTrekDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trekId: string;
  trekTitle: string;
}

export function DeleteTrekDialog({ isOpen, onClose, trekId, trekTitle }: DeleteTrekDialogProps) {
  const handleDelete = async () => {
    const res = await removeTrekAction(trekId);
    if (!res.success) {
      toast.error(res.error || "Failed to delete trek.");
      throw new Error(res.error || "Failed to delete trek.");
    }
    toast.success(`"${trekTitle}" has been deleted.`);
  };

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Trek"
      itemName={trekTitle}
      description="All of its associated content will be permanently removed."
    />
  );
}
