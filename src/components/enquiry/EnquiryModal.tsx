"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnquiryForm } from './EnquiryForm';
import { SuccessState } from './SuccessState';
import type { Trek } from '@/lib/types';

interface EnquiryModalProps {
  trek: Trek;
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ trek, isOpen, onClose }: EnquiryModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  // Focus trapping and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state if closed
      setTimeout(() => setIsSuccess(false), 300);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSuccess = () => {
    setIsSuccess(true);
    // Auto close after 2.5 seconds
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-tb-large overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-tb-border flex justify-between items-center bg-tb-sys-background">
              <h2 id="modal-title" className="text-xl font-bold text-tb-text-primary">
                Enquire about {trek.title}
              </h2>
              <button
                onClick={onClose}
                className="text-tb-text-tertiary hover:text-tb-text-primary p-1.5 rounded-full hover:bg-tb-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {isSuccess ? (
                <SuccessState />
              ) : (
                <EnquiryForm trek={trek} onSuccess={handleSuccess} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
