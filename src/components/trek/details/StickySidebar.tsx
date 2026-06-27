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
  const departures = trek.departures || [];

  // Calculate minimum price among upcoming departures
  const minDeparturePrice = departures.length > 0 
    ? Math.min(...departures.map(d => d.offer_price ?? d.base_price))
    : null;
    
  const displayPrice = minDeparturePrice ?? trek.price_per_person;

  return (
    <>
      <div className="bg-white rounded-2xl border border-tb-border shadow-sm p-6 md:p-8 sticky top-[100px]">
        <div className="mb-6 pb-6 border-b border-tb-border">
          <span className="text-sm font-medium text-tb-text-tertiary block mb-1">Starting from</span>
          <div className="text-3xl font-bold text-tb-text-primary">
            {formatPrice(displayPrice)}
          </div>
          <span className="text-sm text-tb-text-secondary block mt-1">per person</span>
        </div>

        {departures.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-zinc-900 mb-4">Upcoming Departures</h3>
            <div className="space-y-3">
              {departures.map(dep => {
                const depDate = new Date(dep.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const retDate = new Date(dep.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const available = dep.total_seats - dep.booked_seats;
                const effectivePrice = dep.offer_price ?? dep.base_price;
                const isDiscounted = dep.offer_price != null;
                
                return (
                  <div key={dep.id} className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/50 hover:border-tb-primary transition-colors group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-zinc-900 text-sm group-hover:text-tb-primary transition-colors">
                        {depDate} - {retDate}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-tb-primary text-sm">{formatPrice(effectivePrice)}</div>
                        {isDiscounted && (
                          <div className="text-[10px] text-zinc-400 line-through">{formatPrice(dep.base_price)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {available <= 0 ? (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Sold Out</span>
                      ) : available <= 5 ? (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Only {available} Seats Left</span>
                      ) : (
                        <span className="text-xs text-zinc-500">{available} / {dep.total_seats} Seats Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-sm font-semibold text-tb-primary hover:text-tb-primary/80 transition-colors w-full text-center block"
            >
              View All Dates
            </button>
          </div>
        )}

        <div className="space-y-4 mb-8 pt-4 border-t border-tb-border">
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
          {departures.length > 0 ? "Book Departure" : "Enquire Now"}
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
