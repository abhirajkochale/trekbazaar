"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { deleteCompanyAction } from '@/app/admin/(dashboard)/companies/actions';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

export function DeleteCompanyDialog({ isOpen, onClose, companyId, companyName }: DeleteCompanyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteCompanyAction(companyId);
      if (!res.success) {
        toast.error(res.error || "Failed to delete company.");
      } else {
        toast.success(`"${companyName}" has been deleted.`);
        onClose();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An unexpected error occurred.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Company" maxWidth="sm">
      <div className="flex flex-col items-center text-center pb-6 pt-2">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Are you sure?</h3>
        
        <p className="text-sm text-zinc-500">
          This action cannot be undone. This will permanently delete the company <strong>{companyName}</strong>. Any treks linked to this company will remain but will lose their company association.
        </p>
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
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete Company"}
        </button>
      </div>
    </Modal>
  );
}
