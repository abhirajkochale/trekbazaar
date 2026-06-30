"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, X, FileImage, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  progress?: number;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function FileUploadZone({
  onFilesSelected,
  isUploading = false,
  progress = 0,
  maxFiles = 10,
  accept = "image/jpeg, image/png, image/webp",
  maxSizeMB = 10,
  className = "",
  title = "Drag & Drop images here",
  subtitle = "or click to upload from your device",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (files.length > maxFiles) {
      setError(`You can only select up to ${maxFiles} files at once.`);
      return [];
    }

    for (const file of files) {
      if (!file.type.match(/(jpeg|jpg|png|webp)$/i)) {
        setError(`File type not supported: ${file.name}. Only JPG, PNG, and WEBP allowed.`);
        return [];
      }
      if (file.size > maxSizeBytes) {
        setError(`File too large: ${file.name}. Maximum size is ${maxSizeMB}MB.`);
        return [];
      }
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const valid = validateFiles(fileArray);
    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [maxFiles, maxSizeMB]);

  // Paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept paste if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        handleFiles(e.clipboardData.files);
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        multiple={maxFiles > 1}
        accept={accept}
        className="hidden"
        title="Upload file"
        aria-label="Upload file"
      />
      
      <motion.div
        whileHover={!isUploading ? { scale: 1.01 } : {}}
        whileTap={!isUploading ? { scale: 0.99 } : {}}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
          isDragging 
            ? 'border-tb-primary bg-tb-primary/5 shadow-inner' 
            : error 
              ? 'border-red-300 bg-red-50 hover:bg-red-50/80'
              : 'border-dashed border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100'
        } ${isUploading ? 'pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[240px]">
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div 
                key="uploading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center max-w-xs w-full"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 relative">
                  <svg className="w-full h-full absolute inset-0 -rotate-90 text-zinc-100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" />
                  </svg>
                  <svg className="w-full h-full absolute inset-0 -rotate-90 text-tb-primary transition-all duration-300" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="46" fill="none" strokeWidth="8" stroke="currentColor" 
                      strokeDasharray="289" strokeDashoffset={289 - (289 * progress) / 100} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <FileImage className="w-4 h-4 text-tb-primary animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">Uploading...</h4>
                <p className="text-xs text-zinc-500 font-medium mb-3">Please wait while we process your files</p>
                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-tb-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'tween', ease: 'linear' }}
                  />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-sm font-bold text-red-600 mb-1">Upload Failed</p>
                <p className="text-xs text-red-500 max-w-sm">{error}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setError(null); }}
                  className="mt-4 px-4 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-tb-primary text-white scale-110' : 'bg-white shadow-sm border border-zinc-100 text-zinc-400'}`}>
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 mb-1">{title}</h4>
                <p className="text-sm text-zinc-500 font-medium mb-4">{subtitle}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <span>JPG, PNG, WEBP</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <span>Up to {maxSizeMB}MB</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
