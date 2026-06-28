"use client";

import React from 'react';
import { useCheckout } from './CheckoutContext';
import { formatPrice } from '@/lib/format';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function CheckoutSidebar() {
  const { trek, selectedDeparture, formData, step } = useCheckout();

  if (step === 5) return null; // hide on success

  const unitPrice = selectedDeparture.offer_price ?? selectedDeparture.base_price;
  const totalAmount = unitPrice * formData.travellers;
  const discountAmount = (selectedDeparture.base_price - unitPrice) * formData.travellers;
  const hasDiscount = selectedDeparture.offer_price != null && selectedDeparture.offer_price < selectedDeparture.base_price;

  const depDate = new Date(selectedDeparture.departure_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  
  // @ts-expect-error Types might not perfectly align with DB nested joins
  const company = trek.companies;

  return (
    <div className="sticky top-[100px] space-y-6">
      
      {/* Main Summary Card */}
      <div className="bg-white rounded-2xl border border-tb-border shadow-tb-large overflow-hidden">
        {/* Header Image (Optional if we had a thumbnail, skipping for clean UI) */}
        
        <div className="p-6 border-b border-tb-border bg-zinc-50/50">
          <div className="text-sm font-bold text-tb-primary mb-1">{trek.region}</div>
          <h2 className="text-xl font-bold text-zinc-900 leading-tight mb-2">{trek.title}</h2>
          
          <div className="flex items-center gap-2 mt-3 text-sm text-zinc-600">
            {company?.approval_status === 'approved' && (
              <span className="flex items-center gap-1 text-tb-primary bg-tb-primary/10 px-2 py-0.5 rounded font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Operator
              </span>
            )}
            <span className="font-semibold text-zinc-800">{company?.name || 'TrekBazaar'}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-bold text-zinc-900 text-lg">Booking Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Departure</span>
              <span className="font-medium text-zinc-900">{depDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Duration</span>
              <span className="font-medium text-zinc-900">{trek.duration_days} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Travellers</span>
              <span className="font-medium text-zinc-900">{formData.travellers} Person{formData.travellers > 1 ? 's' : ''}</span>
            </div>
          </div>

          <hr className="border-zinc-200" />
          
          <h3 className="font-bold text-zinc-900 text-lg pt-2">Price Breakdown</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">{formatPrice(selectedDeparture.base_price)} x {formData.travellers}</span>
              <span className="font-medium text-zinc-900">{formatPrice(selectedDeparture.base_price * formData.travellers)}</span>
            </div>
            
            {hasDiscount && (
              <div className="flex justify-between text-tb-success font-medium">
                <span>Special Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-zinc-900 text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Total Amount</span>
            <span className="text-2xl font-bold">{formatPrice(totalAmount)}</span>
          </div>
          <div className="text-zinc-400 text-xs text-right">Includes all taxes and fees</div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl border border-tb-border p-5 space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 bg-green-100 text-green-700 p-1.5 rounded-full">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Secure Booking</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">Your data is encrypted. Payment information is securely processed via 256-bit encryption.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-0.5 bg-amber-100 text-amber-700 p-1.5 rounded-full">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Instant Confirmation</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">Your seats are instantly reserved upon successful checkout. No waiting required.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
