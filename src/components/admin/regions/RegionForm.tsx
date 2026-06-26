"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { saveRegion, type RegionFormState } from '@/app/admin/(dashboard)/regions/actions';
import type { RegionWithStats } from '@/lib/admin/regions';
import { slugify } from '@/lib/format';
import toast from 'react-hot-toast';

interface RegionFormProps {
  isOpen: boolean;
  onClose: () => void;
  region?: RegionWithStats; // if passed, we are in edit mode
}

const fieldClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function RegionForm({ isOpen, onClose, region }: RegionFormProps) {
  const [state, formAction, pending] = useActionState<RegionFormState, FormData>(
    saveRegion,
    { error: null }
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  // Reset or populate state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (region) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(region.name);
        setSlug(region.slug);
        setSlugEdited(true);
      } else {
        setName("");
        setSlug("");
        setSlugEdited(false);
      }
    }
  }, [isOpen, region]);

  // Handle successful save
  useEffect(() => {
    if (state?.success) {
      toast.success(region ? 'Region updated successfully' : 'Region created successfully');
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose, region]);

  const onNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={region ? "Edit Region" : "Create Region"} maxWidth="2xl">
      <form action={formAction} className="space-y-6">
        {region && <input type="hidden" name="id" value={region.id} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name & Slug */}
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
                placeholder="e.g. Spiti Valley"
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
              <label htmlFor="hero_image_url" className={labelClasses}>Hero Image URL</label>
              <input
                type="url"
                id="hero_image_url"
                name="hero_image_url"
                defaultValue={region?.hero_image_url || ""}
                className={fieldClasses}
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="status" className={labelClasses}>Status</label>
              <select
                id="status"
                name="status"
                defaultValue={region?.status || "active"}
                className={fieldClasses}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Additional details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="best_season" className={labelClasses}>Best Season</label>
              <input
                type="text"
                id="best_season"
                name="best_season"
                defaultValue={region?.best_season || ""}
                className={fieldClasses}
                placeholder="e.g. Jun to Sep"
              />
            </div>
            
            <div>
              <label htmlFor="altitude_range" className={labelClasses}>Altitude Range</label>
              <input
                type="text"
                id="altitude_range"
                name="altitude_range"
                defaultValue={region?.altitude_range || ""}
                className={fieldClasses}
                placeholder="e.g. 2,500m - 4,500m"
              />
            </div>
            
            <div>
              <label htmlFor="weather" className={labelClasses}>Typical Weather</label>
              <textarea
                id="weather"
                name="weather"
                rows={2}
                defaultValue={region?.weather || ""}
                className={fieldClasses}
                placeholder="Short description of the weather..."
              />
            </div>
          </div>
        </div>

        {/* Full width fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className={labelClasses}>Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={region?.description || ""}
              className={fieldClasses}
            />
          </div>

          <div>
            <label htmlFor="nearby_attractions" className={labelClasses}>Nearby Attractions (One per line)</label>
            <textarea
              id="nearby_attractions"
              name="nearby_attractions"
              rows={3}
              defaultValue={region?.nearby_attractions?.join('\n') || ""}
              className={fieldClasses}
              placeholder="Key Monastery&#10;Chandratal Lake"
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
            {pending ? "Saving..." : "Save Region"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
