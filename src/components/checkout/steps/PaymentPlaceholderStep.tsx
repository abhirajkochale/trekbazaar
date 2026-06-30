"use client";

import React, { useState } from 'react';
import { useCheckout } from '../CheckoutContext';
import { motion } from 'framer-motion';
import { createBookingAction } from '@/app/actions/booking';
import { formatPrice } from '@/lib/format';
import { Lock, CreditCard } from 'lucide-react';

export function PaymentPlaceholderStep() {
  const { step, setStep, formData, selectedDeparture, setBookingRef, isSubmitting, setIsSubmitting } = useCheckout();
  const [error, setError] = useState<string | null>(null);

  if (step !== 4) return null;

  const unitPrice = selectedDeparture.offer_price ?? selectedDeparture.base_price;
  const totalAmount = unitPrice * formData.travellers;

  const handleSimulatePayment = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    // IN A REAL APP: Here we would trigger Razorpay
    // Razorpay.open({ ...options, handler: async function(response) { ... } })
    
    // Simulating payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // After "payment" succeeds, hit our existing RPC booking action
    const res = await createBookingAction({
      departureId: selectedDeparture.id,
      travellersCount: formData.travellers,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      notes: formData.notes
    });

    setIsSubmitting(false);

    if (res.success && res.booking) {
      setBookingRef(res.booking.booking_reference);
      setStep(5); // Success!
    } else {
      setError(res.error || "Failed to finalize booking.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Secure Payment</h2>
          <p className="text-zinc-500 mt-1">Complete your booking securely.</p>
        </div>
        <button onClick={() => setStep(3)} className="text-sm font-medium text-tb-primary hover:underline hidden sm:block">
          Back to Review
        </button>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-400 mb-2">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900">Payment Gateway Integration Placeholder</h3>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            This step is designed to drop-in a Razorpay or Stripe UI without altering the rest of the checkout architecture. Click below to simulate a successful payment.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium bg-zinc-50 py-3 rounded-lg border border-zinc-100">
          <Lock className="w-4 h-4 .5 .5" />
          Payments are securely encrypted
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-bold text-zinc-900">
          Pay Now: <span className="text-tb-primary ml-1">{formatPrice(totalAmount)}</span>
        </div>
        <button
          id="checkout-submit-btn"
          onClick={handleSimulatePayment}
          disabled={isSubmitting}
          className="bg-zinc-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all active:scale-[0.98] w-full sm:w-auto disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Simulate Payment"
          )}
        </button>
      </div>
    </motion.div>
  );
}
