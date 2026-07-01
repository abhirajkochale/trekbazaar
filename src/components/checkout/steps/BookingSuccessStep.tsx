"use client";

import React from 'react';
import { useCheckout } from '../CheckoutContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, MapPin, Calendar, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

export function BookingSuccessStep() {
  const { step, bookingRef, trek, selectedDeparture, formData } = useCheckout();
  const [copied, setCopied] = React.useState(false);

  if (step !== 5) return null;

  const unitPrice = selectedDeparture.offer_price ?? selectedDeparture.base_price;
  const totalAmount = unitPrice * formData.travellers;
  const depDate = new Date(selectedDeparture.departure_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // @ts-expect-error Types
  const company = trek.companies;

  const copyToClipboard = () => {
    if (bookingRef) {
      navigator.clipboard.writeText(bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="p-8 sm:p-12 flex flex-col items-center text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-4 h-4 text-zinc-500" />
      </motion.div>

      <h2 className="text-3xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h2>
      <p className="text-zinc-500 mb-8 max-w-md">
        Pack your bags! Your seats have been successfully reserved. We have sent a confirmation email to <span className="font-medium text-zinc-900">{formData.email}</span>.
      </p>

      <div className="w-full max-w-lg bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-left space-y-6">
        
        <div className="flex flex-col items-center justify-center border-b border-zinc-200 pb-6">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Booking Reference</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-tb-primary tracking-widest">{bookingRef}</span>
            <button 
              onClick={copyToClipboard}
              className="text-zinc-400 hover:text-zinc-900 transition-colors bg-white border border-zinc-200 p-2 rounded-lg shadow-sm"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-zinc-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex gap-3">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 font-medium">Destination</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5 line-clamp-1">{trek.title}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 font-medium">Departure</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5 line-clamp-1">{depDate}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Users className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 font-medium">Travellers</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5 line-clamp-1">{formData.travellers} Person{formData.travellers > 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Home className="w-4 h-4 text-zinc-400 shrink-0" />
            <div>
              <div className="text-xs text-zinc-500 font-medium">Operator</div>
              <div className="font-semibold text-zinc-900 text-sm mt-0.5 line-clamp-1">{company?.name || 'TrekBazaar'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-100 flex justify-between items-center shadow-sm">
          <span className="font-medium text-zinc-700">Amount Paid</span>
          <span className="font-bold text-xl text-zinc-900">{formatPrice(totalAmount)}</span>
        </div>

      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link 
          href="/"
          className="flex-1 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] text-center"
        >
          Explore More Treks
        </Link>
        <Link 
          href="/account/trips"
          className="flex-1 bg-tb-primary hover:bg-tb-primary-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-tb-primary/20 transition-all active:scale-[0.98] text-center block"
        >
          Manage Booking
        </Link>
      </div>

    </motion.div>
  );
}
