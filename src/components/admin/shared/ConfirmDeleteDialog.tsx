"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
  description: string;
  isActionDisabled?: boolean;
  disabledMessage?: React.ReactNode;
}

export function ConfirmDeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemName, 
  description,
  isActionDisabled,
  disabledMessage
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center pb-6 pt-2">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Are you sure?</h3>
        
        {isActionDisabled && disabledMessage ? (
          disabledMessage
        ) : (
          <p className="text-sm text-zinc-500">
            This action cannot be undone. This will permanently delete <strong>{itemName}</strong>. {description}
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
          onClick={handleConfirm}
          disabled={isDeleting || isActionDisabled}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
