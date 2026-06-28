"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import type { Trek } from '@/lib/types';
import { X, Image as ImageIcon, Link as LinkIcon, Trash2, Move, Settings2, Maximize2 } from 'lucide-react';
import { FileUploadZone } from '../../shared/FileUploadZone';
import { uploadService } from '@/lib/storage/UploadService';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { ImageLightbox } from '../../shared/ImageLightbox';

interface Props {
  trek: Partial<Trek>;
  updateField: <K extends keyof Trek>(field: K, value: Trek[K]) => void;
}

export function MediaSection({ trek, updateField }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const gallery = (trek.gallery as string[]) || [];
  
  // Upload States
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  
  // Drag and Drop reordering state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const compressImage = async (file: File) => {
    return await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8
    });
  };

  const handleUploadCover = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingCover(true);
    setCoverProgress(10);
    try {
      const file = files[0];
      const compressed = await compressImage(file);
      setCoverProgress(40);
      
      const ext = file.name.split('.').pop();
      const path = `covers/${uuidv4()}.${ext}`;
      
      const url = await uploadService.upload(compressed, path);
      setCoverProgress(100);
      updateField('cover_image_url', url);
      toast.success('Cover image uploaded successfully');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to upload cover image');
    } finally {
      setTimeout(() => setIsUploadingCover(false), 500);
    }
  };

  const handleUploadGallery = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    setGalleryProgress(10);
    try {
      const newUrls = [...gallery];
      
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        const ext = files[i].name.split('.').pop();
        const path = `gallery/${uuidv4()}.${ext}`;
        const url = await uploadService.upload(compressed, path);
        newUrls.push(url);
        setGalleryProgress(10 + Math.floor(((i + 1) / files.length) * 80));
      }
      
      setGalleryProgress(100);
      updateField('gallery', newUrls);
      toast.success(`${files.length} images uploaded to gallery`);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to upload gallery images');
    } finally {
      setTimeout(() => setIsUploadingGallery(false), 500);
    }
  };

  const handleRemoveGallery = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    updateField('gallery', newGallery);
  };

  // Drag Reordering Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e.dataTransfer.setData('text/html', e.currentTarget.parentNode as any);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newGallery = [...gallery];
    const item = newGallery.splice(draggedIdx, 1)[0];
    newGallery.splice(index, 0, item);
    setDraggedIdx(index);
    updateField('gallery', newGallery);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-10">
      {/* Lightbox */}
      <ImageLightbox 
        images={trek.cover_image_url ? [trek.cover_image_url, ...gallery] : gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* Cover Image Area */}
      <div>
        <h3 className="text-base font-bold text-zinc-900 mb-4">Cover Image</h3>
        <div className="flex flex-col gap-4">
          {!trek.cover_image_url || isUploadingCover ? (
            <FileUploadZone 
              onFilesSelected={handleUploadCover}
              isUploading={isUploadingCover}
              progress={coverProgress}
              maxFiles={1}
              title="Drag & Drop your Cover Photo"
              subtitle="This is the first thing customers will see"
            />
          ) : (
            <div className="w-full aspect-[21/9] sm:aspect-[4/1] bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden relative group shadow-sm">
              <img 
                src={trek.cover_image_url} 
                alt="Cover" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => setLightboxIndex(0)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={() => updateField('cover_image_url', '')}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-100" />

      {/* Gallery Images Area */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Image Gallery</h3>
            <p className="text-xs text-zinc-500 font-medium mt-1">Upload high-quality images to showcase the trekking experience.</p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-3 py-1 rounded-md">
            {gallery.length} Images
          </span>
        </div>
        
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {gallery.map((url, index) => (
              <div 
                key={`${url}-${index}`} 
                className={`relative group aspect-square rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-100 cursor-grab active:cursor-grabbing transition-all ${draggedIdx === index ? 'scale-95 opacity-50 shadow-inner' : 'hover:-translate-y-1 hover:shadow-md'}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 cursor-grab hover:bg-black/60 transition-colors">
                      <Move className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveGallery(index); }}
                      className="w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-white/90 drop-shadow-md">
                      Image {index + 1}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setLightboxIndex(trek.cover_image_url ? index + 1 : index)}
                      className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <FileUploadZone 
          onFilesSelected={handleUploadGallery}
          isUploading={isUploadingGallery}
          progress={galleryProgress}
          maxFiles={10}
          title={gallery.length === 0 ? "Drag & Drop Gallery Images" : "Add More Images"}
          subtitle="You can select up to 10 images at once"
        />
      </div>

      <div className="w-full h-px bg-zinc-100" />

      {/* Advanced Options (Legacy URL Workflow) */}
      <div className="pt-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          {showAdvanced ? "Hide Advanced Options" : "Advanced Options (Legacy URLs)"}
        </button>
        
        {showAdvanced && (
          <div className="mt-6 space-y-6 bg-zinc-50/50 border border-zinc-200 rounded-xl p-6">
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-1.5">Cover Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="url"
                  value={trek.cover_image_url || ''}
                  onChange={(e) => updateField('cover_image_url', e.target.value)}
                  className="block w-full rounded-lg border border-zinc-300 pl-9 pr-3 py-2 text-sm focus:border-tb-primary outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-1.5">Append Gallery URL</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="url"
                    id="legacy-gallery-url"
                    placeholder="https://example.com/gallery1.jpg"
                    className="block w-full rounded-lg border border-zinc-300 pl-9 pr-3 py-2 text-sm focus:border-tb-primary outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          updateField('gallery', [...gallery, input.value.trim()]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('legacy-gallery-url') as HTMLInputElement;
                    if (input.value.trim()) {
                      updateField('gallery', [...gallery, input.value.trim()]);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 font-bold text-sm transition-all"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
