"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { saveCategory, type CategoryFormState } from '@/app/admin/(dashboard)/master-trek-categories/actions';
import type { CategoryWithStats } from '@/lib/admin/categories';
import { slugify } from '@/lib/format';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryWithStats;
}

const fieldClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    saveCategory,
    { error: null }
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(category.name);
        setSlug(category.slug);
        setSlugEdited(true);
      } else {
        setName("");
        setSlug("");
        setSlugEdited(false);
      }
    }
  }, [isOpen, category]);

  useEffect(() => {
    if (state?.success) {
      toast.success(category ? 'Category updated successfully' : 'Category created successfully');
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose, category]);

  const onNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? "Edit Category" : "Create Category"} maxWidth="lg">
      <form action={formAction} className="space-y-6">
        {category && <input type="hidden" name="id" value={category.id} />}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClasses}>Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className={fieldClasses}
              placeholder="e.g. Winter Treks"
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelClasses}>Slug <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className={fieldClasses}
            />
            <p className="mt-1 text-xs text-zinc-500">Auto-generated from name. Must be unique.</p>
          </div>
          
          <div>
            <label htmlFor="status" className={labelClasses}>Status</label>
            <select
              id="status"
              name="status"
              defaultValue={category?.status || "active"}
              className={fieldClasses}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={category?.description || ""}
              className={fieldClasses}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-white bg-tb-primary rounded-lg hover:bg-tb-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
