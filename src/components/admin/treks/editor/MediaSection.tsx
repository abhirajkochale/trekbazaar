"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import type { Trek } from '@/lib/types';
import { Plus, X, GripHorizontal } from 'lucide-react';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

export function MediaSection({ trek, updateField }: Props) {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const gallery = (trek.gallery_images as string[]) || [];

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    updateField('gallery_images', [...gallery, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGallery = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    updateField('gallery_images', newGallery);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === gallery.length - 1) return;

    const newGallery = [...gallery];
    const swapIndex = direction === 'left' ? index - 1 : index + 1;
    
    [newGallery[index], newGallery[swapIndex]] = [newGallery[swapIndex], newGallery[index]];
    
    updateField('gallery_images', newGallery);
  };

  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div>
        <h3 className="text-sm font-medium text-zinc-900 mb-3">Cover Image</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-1/3 aspect-[4/3] bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative flex-shrink-0">
            {trek.cover_image_url ? (
              <img 
                src={trek.cover_image_url} 
                alt="Cover Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                No Cover Image
              </div>
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="block text-xs font-medium text-zinc-500">Image URL</label>
            <input
              type="url"
              value={trek.cover_image_url || ''}
              onChange={(e) => updateField('cover_image_url', e.target.value)}
              className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-zinc-500">Provide a high-resolution landscape image (1920x1080 recommended).</p>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="pt-6 border-t border-zinc-200">
        <h3 className="text-sm font-medium text-zinc-900 mb-3">Image Gallery</h3>
        
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {gallery.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group aspect-square rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'left')}
                    disabled={index === 0}
                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white disabled:opacity-30 transition-colors"
                  >
                    <GripHorizontal className="w-4 h-4 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveGallery(index)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'right')}
                    disabled={index === gallery.length - 1}
                    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white disabled:opacity-30 transition-colors"
                  >
                    <GripHorizontal className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddGallery} className="flex items-center gap-2">
          <input
            type="url"
            value={newGalleryUrl}
            onChange={(e) => setNewGalleryUrl(e.target.value)}
            placeholder="Add gallery image URL..."
            className="flex-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-tb-primary focus:outline-none focus:ring-1 focus:ring-tb-primary"
          />
          <button
            type="submit"
            disabled={!newGalleryUrl.trim()}
            className="p-2 bg-tb-primary text-white rounded-md hover:bg-tb-primary/90 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
