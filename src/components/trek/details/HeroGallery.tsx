"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { formatPrice, formatDuration, difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import type { Trek } from '@/lib/types';

interface HeroGalleryProps {
  trek: Trek & { gallery?: string[] };
}

export function HeroGallery({ trek }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = trek.cover_image_url ? [trek.cover_image_url] : [];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % images.length);
    if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, lightboxOpen]);

  return (
    <>
      <section className="relative w-full bg-tb-sys-background flex flex-col">
        {/* Desktop & Mobile Hero Image Area */}
        <div 
          className="relative w-full h-[50vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] max-h-[800px] cursor-zoom-in overflow-hidden group"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Open fullscreen gallery"
          onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
        >
          {images.length > 0 ? (
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`Gallery image ${activeIndex + 1} of ${trek.title}`}
                  fill
                  priority={activeIndex === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-zinc-800" />
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />

          <Container className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-12 text-white flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
            <div className="max-w-4xl pointer-events-auto">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${difficultyBadgeClasses(trek.difficulty)}`}>
                  {difficultyLabel(trek.difficulty)}
                </span>
                <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {trek.region}
                </span>
                <span className="flex items-center text-sm font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <svg className="w-4 h-4 mr-1.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(trek.duration_days)}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white leading-tight">
                {trek.title}
              </h1>

              <div className="flex items-end gap-2 text-white/90">
                <span className="text-sm md:text-base opacity-80 mb-1">Starting from</span>
                <span className="text-2xl md:text-3xl font-bold text-white">{formatPrice(trek.price_per_person)}</span>
              </div>
            </div>

          </Container>
        </div>

      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image Gallery"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
              aria-label="Close gallery"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev - 1 + images.length) % images.length); }}
              className="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white p-3 rounded-full bg-black/20 hover:bg-black/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Lightbox Image */}
            <div className="relative w-full h-full max-w-7xl max-h-[85vh] mx-4 md:mx-20 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[activeIndex]}
                    alt={`Gallery fullscreen ${activeIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev + 1) % images.length); }}
              className="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white p-3 rounded-full bg-black/20 hover:bg-black/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Lightbox Thumbnails */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary ${
                    activeIndex === idx ? 'border-white opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt={`Lightbox Thumbnail ${idx + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
