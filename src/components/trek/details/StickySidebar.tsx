"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDuration, difficultyLabel } from '@/lib/format';
import { EnquiryModal } from '@/components/enquiry/EnquiryModal';
import type { Trek } from '@/lib/types';

interface StickySidebarProps {
  trek: Trek;
}

export function StickySidebar({ trek }: StickySidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 sticky top-[100px]">
        <div className="mb-6 pb-6 border-b border-tb-border">
          <span className="text-sm font-medium text-tb-text-tertiary block mb-1">Starting from</span>
          <div className="text-3xl font-bold text-tb-text-primary">
            {formatPrice(trek.price_per_person)}
          </div>
          <span className="text-sm text-tb-text-secondary block mt-1">per person</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-tb-text-secondary text-sm">Duration</span>
            <span className="font-semibold text-tb-text-primary text-sm">{formatDuration(trek.duration_days)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-tb-text-secondary text-sm">Difficulty</span>
            <span className="font-semibold text-tb-text-primary text-sm">{difficultyLabel(trek.difficulty)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-tb-text-secondary text-sm">Operator</span>
            <span className="font-semibold text-tb-primary text-sm line-clamp-1 max-w-[140px] text-right">
              {trek.operator_name || 'TrekBazaar'}
            </span>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          className="mb-4 text-base font-bold h-14"
          onClick={() => setIsModalOpen(true)}
        >
          Enquire Now
        </Button>
        
        <p className="text-xs text-center text-tb-text-tertiary">
          No payment required to enquire. Our team will contact you within 24 hours.
        </p>
      </div>

      {/* Orchestrated Modal Portal */}
      <EnquiryModal 
        trek={trek} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
