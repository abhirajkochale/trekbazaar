"use client";

import React, { useState } from 'react';
import { performDeleteMasterTrek, performArchiveMasterTrek } from '@/app/admin/(dashboard)/master-treks/actions';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteMasterTrekDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  packagesCount: number;
  status: string;
}

export function DeleteMasterTrekDialog({ isOpen, onClose, id, name, packagesCount, status }: DeleteMasterTrekDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await performDeleteMasterTrek(id);
    setIsDeleting(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`${name} has been deleted.`);
      onClose();
    }
  };

  const handleArchive = async () => {
    setIsDeleting(true);
    const res = await performArchiveMasterTrek(id);
    setIsDeleting(false);
    
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(`${name} has been archived.`);
      onClose();
    }
  };

  const canDelete = packagesCount === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Master Trek">
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-red-50 text-red-900 rounded-lg">
          <AlertTriangle className="w-4 h-4 mt-0.5 text-zinc-500 shrink-0" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Are you sure you want to delete {name}?</p>
            {canDelete ? (
              <p>This action cannot be undone. All data will be permanently removed.</p>
            ) : (
              <p>
                <strong>You cannot delete this Master Trek</strong> because it has <strong>{packagesCount}</strong> linked company packages. Deleting it would break those packages. 
                <br /><br />
                {status !== 'archived' && "You can choose to Archive it instead, which hides it from discovery but preserves existing links."}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          
          {!canDelete && status !== 'archived' && (
            <button
              onClick={handleArchive}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
            >
              Archive Instead
            </button>
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete permanently"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
