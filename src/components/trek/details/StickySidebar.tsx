"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDuration, difficultyLabel } from '@/lib/format';
import { EnquiryModal } from '@/components/enquiry/EnquiryModal';
import { BookingModal } from '@/components/booking/BookingModal';
import type { Trek, Departure } from '@/lib/types';

interface StickySidebarProps {
  trek: Trek;
}

export function StickySidebar({ trek }: StickySidebarProps) {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [bookingModalState, setBookingModalState] = useState<{ isOpen: boolean; departure: Departure | null }>({
    isOpen: false,
    departure: null
  });
  
  const departures = trek.departures || [];
  const activeDepartures = departures.filter(d => d.is_active && d.status !== 'Cancelled' && d.status !== 'Completed');

  // Calculate minimum price among active departures
  const minDeparturePrice = activeDepartures.length > 0 
    ? Math.min(...activeDepartures.map(d => d.offer_price ?? d.base_price))
    : null;
    
  const displayPrice = minDeparturePrice ?? trek.price_per_person;

  const handleBookClick = (dep: Departure) => {
    setBookingModalState({ isOpen: true, departure: dep });
  };

  const handleMainCTA = () => {
    if (activeDepartures.length > 0) {
      handleBookClick(activeDepartures[0]);
    } else {
      setIsEnquiryModalOpen(true);
    }
  };

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

        {activeDepartures.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-zinc-900 mb-4">Upcoming Departures</h3>
            <div className="space-y-3">
              {activeDepartures.map(dep => {
                const depDate = new Date(dep.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const retDate = new Date(dep.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const available = dep.total_seats - dep.booked_seats;
                const effectivePrice = dep.offer_price ?? dep.base_price;
                const isDiscounted = dep.offer_price != null;
                const isSoldOut = available <= 0 || dep.status === 'Full';
                
                return (
                  <div 
                    key={dep.id} 
                    className={`p-3 border rounded-lg transition-colors group ${
                      isSoldOut 
                        ? 'border-zinc-200 bg-zinc-50 opacity-75 cursor-not-allowed'
                        : 'border-zinc-200 bg-zinc-50/50 hover:border-tb-primary cursor-pointer'
                    }`} 
                    onClick={() => !isSoldOut && handleBookClick(dep)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={`font-semibold text-sm transition-colors ${
                        isSoldOut ? 'text-zinc-600' : 'text-zinc-900 group-hover:text-tb-primary'
                      }`}>
                        {depDate} - {retDate}
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${isSoldOut ? 'text-zinc-600' : 'text-tb-primary'}`}>
                          {formatPrice(effectivePrice)}
                        </div>
                        {isDiscounted && (
                          <div className="text-[10px] text-zinc-400 line-through">{formatPrice(dep.base_price)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {isSoldOut ? (
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
          onClick={handleMainCTA}
        >
          {activeDepartures.length > 0 ? "Book Departure" : "Enquire Now"}
        </Button>
        
        {activeDepartures.length === 0 && (
          <p className="text-xs text-center text-tb-text-tertiary">
            No payment required to enquire. Our team will contact you within 24 hours.
          </p>
        )}
      </div>

      <EnquiryModal 
        trek={trek} 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setIsEnquiryModalOpen(false)} 
      />
      
      <BookingModal
        trek={trek}
        departure={bookingModalState.departure}
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ isOpen: false, departure: null })}
      />
    </>
  );
}
