"use client";

import React from 'react';
import { deleteDepartureAction } from '@/app/admin/(dashboard)/departures/actions';
import toast from 'react-hot-toast';
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  departureId: string;
}

export function DeleteDepartureDialog({ isOpen, onClose, departureId }: Props) {
  const handleDelete = async () => {
    const res = await deleteDepartureAction(departureId);
    if (!res.success) {
      toast.error(res.error || "Failed to delete departure.");
      throw new Error(res.error || "Failed to delete departure.");
    }
    toast.success(`Departure deleted.`);
  };

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Departure"
      itemName="this scheduled departure"
      description="It may orphan any associated bookings."
    />
  );
}
