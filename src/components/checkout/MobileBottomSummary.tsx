"use client";

import React, { useState } from 'react';
import { useCheckout } from './CheckoutContext';
import { formatPrice } from '@/lib/format';
import { ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileBottomSummary() {
  const { trek, selectedDeparture, formData, step, isSubmitting } = useCheckout();
  const [isOpen, setIsOpen] = useState(false);

  if (step === 5) return null;

  const unitPrice = selectedDeparture.offer_price ?? selectedDeparture.base_price;
  const totalAmount = unitPrice * formData.travellers;
  
  // Find the button in the current step and trigger its click
  const handleMobileSubmit = () => {
    // This is a common pattern to trigger a form submit from outside the form on mobile
    const submitBtn = document.getElementById('checkout-submit-btn');
    if (submitBtn) {
      submitBtn.click();
    }
  };

  const getButtonText = () => {
    switch(step) {
      case 1: return "Continue to Details";
      case 2: return "Review Booking";
      case 3: return "Proceed to Payment";
      case 4: return "Confirm Booking";
      default: return "Continue";
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-tb-border shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
      
      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-zinc-100 bg-zinc-50"
          >
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs font-bold text-tb-primary mb-1 uppercase tracking-wider">{trek.region}</div>
                <h3 className="font-bold text-zinc-900 leading-tight">{trek.title}</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Departure</span>
                  <span className="font-medium text-zinc-900">
                    {new Date(selectedDeparture.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Travellers</span>
                  <span className="font-medium text-zinc-900">{formData.travellers} Person{formData.travellers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200">
                  <span className="text-zinc-600 font-medium">Price Breakdown</span>
                  <span className="font-medium text-zinc-900">{formatPrice(unitPrice)} x {formData.travellers}</span>
                </div>
              </div>

              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  Best Price Guarantee. No hidden booking fees. Secure 256-bit encryption.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar */}
      <div className="p-4 flex flex-col gap-3 pb-6 sm:pb-4">
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-full focus:outline-none"
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium uppercase tracking-wider">
              {isOpen ? 'Hide Summary' : 'Show Summary'}
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
            <div className="text-xl font-bold text-zinc-900">
              {formatPrice(totalAmount)}
            </div>
          </div>
        </button>

        <button 
          onClick={handleMobileSubmit}
          disabled={isSubmitting}
          className="w-full bg-tb-primary hover:bg-tb-primary-hover active:scale-[0.98] transition-all text-white font-bold py-3.5 rounded-xl shadow-lg shadow-tb-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            getButtonText()
          )}
        </button>
        
      </div>
    </div>
  );
}
