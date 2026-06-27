"use client";

import React from 'react';
import { useCheckout } from '../CheckoutContext';
import { formatPrice } from '@/lib/format';
import { Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function DepartureSelectionStep() {
  const { step, setStep, allDepartures, selectedDeparture, setSelectedDeparture } = useCheckout();

  if (step !== 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Choose your departure</h2>
        <p className="text-zinc-500 mt-1">Select the dates that work best for you.</p>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {allDepartures.map((dep) => {
          const isSelected = selectedDeparture.id === dep.id;
          const available = dep.total_seats - dep.booked_seats;
          const isSoldOut = available <= 0 || dep.status === 'Full';
          const effectivePrice = dep.offer_price ?? dep.base_price;
          const hasDiscount = dep.offer_price != null && dep.offer_price < dep.base_price;
          
          const depDate = new Date(dep.departure_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          const retDate = new Date(dep.return_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <div 
              key={dep.id}
              onClick={() => !isSoldOut && setSelectedDeparture(dep)}
              className={`relative border-2 rounded-xl p-4 sm:p-5 transition-all cursor-pointer ${
                isSoldOut 
                  ? 'border-zinc-100 bg-zinc-50 opacity-70 cursor-not-allowed'
                  : isSelected 
                    ? 'border-tb-primary bg-tb-primary/5 shadow-md shadow-tb-primary/10' 
                    : 'border-zinc-200 hover:border-tb-primary/50 hover:bg-zinc-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-tb-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                  Selected
                </div>
              )}
              
              {hasDiscount && !isSoldOut && !isSelected && (
                <div className="absolute -top-3 left-4 bg-tb-success text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Special Offer
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-5 h-5 ${isSoldOut ? 'text-zinc-400' : 'text-tb-primary'}`} />
                    <span className="font-bold text-zinc-900 text-lg">
                      {depDate} <span className="text-zinc-400 font-normal mx-1">→</span> {retDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-zinc-500" />
                    {isSoldOut ? (
                      <span className="text-red-500 font-medium">Sold Out</span>
                    ) : available <= 5 ? (
                      <span className="text-amber-600 font-medium">Only {available} seats left</span>
                    ) : (
                      <span className="text-zinc-500">{available} seats available</span>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0">
                  <div className="text-sm text-zinc-500 mb-0.5">Price per person</div>
                  <div className={`text-xl font-bold ${isSelected ? 'text-tb-primary' : 'text-zinc-900'}`}>
                    {formatPrice(effectivePrice)}
                  </div>
                  {hasDiscount && (
                    <div className="text-xs text-zinc-400 line-through">
                      {formatPrice(dep.base_price)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
        <button
          id="checkout-submit-btn"
          onClick={() => setStep(2)}
          className="bg-tb-primary hover:bg-tb-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-tb-primary/20 transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          Continue to Details
        </button>
      </div>
    </motion.div>
  );
}
