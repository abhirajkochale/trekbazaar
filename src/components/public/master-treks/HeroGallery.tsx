"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { difficultyLabel, difficultyBadgeClasses } from '@/lib/format';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTrek: any;
}

export function HeroGallery({ masterTrek }: Props) {
  let rawImages: string[] = [];
  
  let parsedGallery = masterTrek.gallery;
  if (typeof parsedGallery === 'string') {
    try { parsedGallery = JSON.parse(parsedGallery); } catch (e) {}
  }

  if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
    rawImages = masterTrek.cover_image ? [masterTrek.cover_image, ...parsedGallery] : parsedGallery;
  } else if (masterTrek.cover_image) {
    rawImages = [masterTrek.cover_image];
  } else {
    rawImages = [];
  }

  // Ensure unique URLs for the gallery to prevent key collisions
  const images = Array.from(new Set(rawImages));
  const hasMultiple = images.length > 1;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight' && hasMultiple) {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft' && hasMultiple) {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length, hasMultiple]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxOpen]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] bg-zinc-900 flex items-center justify-center">
        {/* Title Overlay for empty state */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32 pb-8 px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
              {masterTrek.name}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black">
      {/* 
        DESKTOP GALLERY 
        If >= 5 images, show 1 large + 4 small grid.
        If 1-4 images, just show 1 large to keep layout unbroken.
      */}
      <div className="hidden md:flex w-full h-[60vh] min-h-[500px] max-h-[700px] gap-2 pt-2">
        <div 
          className={`relative ${images.length >= 5 ? 'w-1/2' : 'w-full'} h-full cursor-pointer group rounded-l-2xl overflow-hidden ml-2`}
          onClick={() => openLightbox(0)}
        >
          <Image 
            src={images[0]} 
            alt={`${masterTrek.name} Gallery 1`}
            fill
            sizes="50vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {images.length >= 5 && (
          <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-2 mr-2">
            {[1, 2, 3, 4].map((idx) => (
              <div 
                key={idx} 
                className={`relative w-full h-full cursor-pointer group overflow-hidden ${idx === 2 ? 'rounded-tr-2xl' : ''} ${idx === 4 ? 'rounded-br-2xl' : ''}`}
                onClick={() => openLightbox(idx)}
              >
                <Image 
                  src={images[idx]} 
                  alt={`${masterTrek.name} Gallery ${idx + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show All Photos Button (Desktop) */}
      {hasMultiple && (
        <button 
          onClick={() => openLightbox(0)}
          className="hidden md:flex absolute bottom-8 right-8 bg-white/90 backdrop-blur-md text-zinc-900 px-4 py-2 rounded-lg font-bold items-center gap-2 shadow-lg hover:bg-white transition-colors z-10"
        >
          <Maximize2 className="w-4 h-4" />
          Show all {images.length} photos
        </button>
      )}

      {/* 
        MOBILE GALLERY (Swipeable Carousel)
      */}
      <div className="md:hidden relative w-full h-[65vh] flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-full h-full shrink-0 snap-center" onClick={() => openLightbox(idx)}>
            <Image 
              src={img}
              alt={`${masterTrek.name} Mobile Gallery ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        {hasMultiple && (
          <div className="absolute bottom-6 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 pointer-events-none tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Title Overlay for Mobile/Desktop fallback */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32 pb-8 px-4 sm:px-6 lg:px-8 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3 pointer-events-auto">
            {masterTrek.category?.name && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                {masterTrek.category.name}
              </span>
            )}
            {masterTrek.region?.name && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                {masterTrek.region.name}
              </span>
            )}
            {masterTrek.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${difficultyBadgeClasses(masterTrek.difficulty)}`}>
                {difficultyLabel(masterTrek.difficulty)}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
            {masterTrek.name}
          </h1>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="flex justify-between items-center p-4 md:p-6 absolute top-0 inset-x-0 z-10">
              <span className="text-white/70 font-medium tracking-widest text-sm">
                {currentIndex + 1} / {images.length}
              </span>
              <button 
                onClick={() => setLightboxOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close Gallery"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-6xl h-[80vh] px-4"
                >
                  <Image 
                    src={images[currentIndex]}
                    alt={`Gallery Full ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {hasMultiple && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-white hover:text-black border border-white/10 text-white rounded-full transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 ml-[-2px]" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-white hover:text-black border border-white/10 text-white rounded-full transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 mr-[-2px]" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
