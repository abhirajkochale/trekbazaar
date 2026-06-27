"use client";

import React, { useState } from 'react';
import { useCheckout } from '../CheckoutContext';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/format';
import { FileText, AlertTriangle } from 'lucide-react';

export function BookingReviewStep() {
  const { step, setStep, formData, selectedDeparture, trek } = useCheckout();
  const [agreed, setAgreed] = useState(false);

  if (step !== 3) return null;

  const unitPrice = selectedDeparture.offer_price ?? selectedDeparture.base_price;
  const totalAmount = unitPrice * formData.travellers;
  const depDate = new Date(selectedDeparture.departure_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // @ts-expect-error Types
  const company = trek.companies;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Review your booking</h2>
          <p className="text-zinc-500 mt-1">Almost there! Please verify your details before proceeding to payment.</p>
        </div>
        <button onClick={() => setStep(2)} className="text-sm font-medium text-tb-primary hover:underline hidden sm:block">
          Edit Details
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Verification Summary */}
        <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Trek Details</div>
              <div className="font-bold text-zinc-900">{trek.title}</div>
              <div className="text-sm text-zinc-600 mt-0.5">Operated by {company?.name || 'TrekBazaar'}</div>
            </div>
          </div>
          
          <div className="p-4 sm:p-5 flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Departure</div>
              <div className="font-medium text-zinc-900">{depDate}</div>
              <div className="text-sm text-zinc-600 mt-0.5">{trek.duration_days} Days</div>
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-tb-primary font-medium hover:underline">Change</button>
          </div>

          <div className="p-4 sm:p-5 flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Primary Traveller</div>
              <div className="font-medium text-zinc-900">{formData.name}</div>
              <div className="text-sm text-zinc-600 mt-0.5">{formData.email} • {formData.phone}</div>
              <div className="text-sm text-zinc-600 mt-0.5 font-medium">{formData.travellers} Person{formData.travellers > 1 ? 's' : ''}</div>
            </div>
            <button onClick={() => setStep(2)} className="text-sm text-tb-primary font-medium hover:underline">Edit</button>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-zinc-50 p-4 sm:p-5 rounded-xl border border-zinc-200">
          <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            Cancellation Policy
          </h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Free cancellation up to 30 days before departure. Cancellations within 30 days are subject to a 50% fee. No-shows are non-refundable. By completing this booking, you agree to these terms.
          </p>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-zinc-300 rounded peer-checked:bg-tb-primary peer-checked:border-tb-primary transition-colors flex items-center justify-center">
              <motion.svg 
                initial={false}
                animate={{ opacity: agreed ? 1 : 0, scale: agreed ? 1 : 0.5 }}
                className="w-3.5 h-3.5 text-white" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
          </div>
          <span className="text-sm text-zinc-700 select-none">
            I confirm that all details are correct and I agree to the <span className="text-tb-primary font-medium hover:underline">Terms & Conditions</span> and <span className="text-tb-primary font-medium hover:underline">Privacy Policy</span>.
          </span>
        </label>
        
        {!agreed && (
          <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> Please agree to the terms to proceed.
          </div>
        )}

      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-bold text-zinc-900">
          Total to Pay: <span className="text-tb-primary ml-1">{formatPrice(totalAmount)}</span>
        </div>
        <button
          id="checkout-submit-btn"
          onClick={() => agreed && setStep(4)}
          disabled={!agreed}
          className="bg-tb-primary hover:bg-tb-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-tb-primary/20 transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          Proceed to Payment
        </button>
      </div>
    </motion.div>
  );
}
