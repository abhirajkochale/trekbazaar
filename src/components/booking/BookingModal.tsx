"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingForm } from './BookingForm';
import type { Departure, Trek } from '@/lib/types';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface BookingModalProps {
  trek: Trek;
  departure: Departure | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ trek, departure, isOpen, onClose }: BookingModalProps) {
  const [successRef, setSuccessRef] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setSuccessRef(null), 300);
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

  const handleSuccess = (ref: string) => {
    setSuccessRef(ref);
  };

  if (!departure) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-tb-large overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-4 border-b border-tb-border flex justify-between items-center bg-tb-sys-background">
              <h2 className="text-xl font-bold text-tb-text-primary">
                Book {trek.title}
              </h2>
              <button
                onClick={onClose}
                className="text-tb-text-tertiary hover:text-tb-text-primary p-1.5 rounded-full hover:bg-tb-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {successRef ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Booking Successful!</h3>
                  <p className="text-zinc-600 mb-6">
                    Your booking reference is <strong className="text-zinc-900">{successRef}</strong>. <br/>
                    We&apos;ve sent a confirmation email to you.
                  </p>
                  <Button variant="primary" onClick={onClose} className="px-8">
                    Return to Trek
                  </Button>
                </div>
              ) : (
                <BookingForm departure={departure} onSuccess={handleSuccess} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
