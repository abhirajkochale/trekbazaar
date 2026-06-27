"use client";

import React, { useState } from 'react';
import type { MasterTrek } from '@/lib/types';
import { X, GripVertical } from 'lucide-react';

interface Props {
  masterTrek: Partial<MasterTrek>;
  updateField: <K extends keyof MasterTrek>(field: K, value: MasterTrek[K]) => void;
}

const inputClasses = "mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary bg-white";
const labelClasses = "block text-sm font-medium text-zinc-700";

export function MasterMediaSection({ masterTrek, updateField }: Props) {
  const [newImage, setNewImage] = useState('');
  const gallery = masterTrek.gallery || [];

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.trim()) return;
    updateField('gallery', [...gallery, newImage.trim()]);
    setNewImage('');
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...gallery];
    updated.splice(index, 1);
    updateField('gallery', updated);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === gallery.length - 1) return;
    const updated = [...gallery];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    updateField('gallery', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClasses}>Cover Image URL</label>
        <div className="mt-1 flex gap-4 items-start">
          <input
            type="url"
            value={masterTrek.cover_image || ''}
            onChange={(e) => updateField('cover_image', e.target.value)}
            className={inputClasses}
            placeholder="https://..."
          />
          {masterTrek.cover_image && (
            <div className="shrink-0 w-24 h-16 rounded-md border border-zinc-200 overflow-hidden relative bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={masterTrek.cover_image} alt="Cover Preview" className="object-cover w-full h-full" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Gallery Images</label>
        
        {gallery.length > 0 && (
          <div className="mt-2 mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <div key={`${img}-${index}`} className="relative group rounded-lg overflow-hidden border border-zinc-200 aspect-[4/3] bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Gallery ${index + 1}`} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded text-white disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddImage} className="flex gap-2">
          <input
            type="url"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Add image URL..."
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={!newImage.trim()}
            className="mt-1 px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
