"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';
import type { Departure } from '@/lib/types';
import { createBookingAction } from '@/app/actions/booking';

interface BookingFormProps {
  departure: Departure;
  onSuccess: (bookingRef: string) => void;
}

export function BookingForm({ departure, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travellers: 1,
    notes: ''
  });

  const availableSeats = departure.total_seats - departure.booked_seats;
  const unitPrice = departure.offer_price ?? departure.base_price;
  const totalAmount = unitPrice * formData.travellers;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Prevent exceeding available seats via UI
    if (name === 'travellers') {
      const val = parseInt(value, 10);
      if (val > availableSeats) {
        return; // ignore input
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (formData.travellers < 1 || formData.travellers > availableSeats) {
      setError(`Please select a valid number of travellers (1 to ${availableSeats}).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await createBookingAction({
      departureId: departure.id,
      travellersCount: formData.travellers,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      notes: formData.notes
    });

    if (res.success && res.booking) {
      onSuccess(res.booking.booking_reference);
    } else {
      setError(res.error || "Failed to create booking.");
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full rounded-tb-md border border-tb-border bg-white px-3 py-2 text-sm text-tb-text-primary placeholder:text-tb-text-tertiary focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary transition-colors";
  const labelClasses = "block text-sm font-medium text-tb-text-secondary mb-1.5";

  const departureDateFormatted = new Date(departure.departure_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-tb-danger/10 border border-tb-danger/20 text-tb-danger text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Live Booking Summary */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-zinc-900">Booking Summary</h3>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-600">Departure Date</span>
          <span className="font-medium text-zinc-900">{departureDateFormatted}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-600">Price per person</span>
          <span className="font-medium text-zinc-900">{formatPrice(unitPrice)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-600 font-medium">Travellers</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              name="travellers"
              min="1"
              max={availableSeats}
              value={formData.travellers}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm text-center font-medium focus:ring-2 focus:ring-tb-primary outline-none"
            />
            <span className="text-xs text-zinc-500">of {availableSeats} left</span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 flex justify-between items-center">
          <span className="font-bold text-zinc-900">Total Amount</span>
          <span className="text-xl font-bold text-tb-primary">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div>
        <label htmlFor="name" className={labelClasses}>Full Name *</label>
        <input 
          type="text" id="name" name="name" required 
          value={formData.name} onChange={handleChange}
          className={inputClasses} placeholder="John Doe" disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClasses}>Email *</label>
          <input 
            type="email" id="email" name="email" required 
            value={formData.email} onChange={handleChange}
            className={inputClasses} placeholder="john@example.com" disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
          <input 
            type="tel" id="phone" name="phone" required 
            value={formData.phone} onChange={handleChange}
            className={inputClasses} placeholder="+91 98765 43210" disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClasses}>Special Requests / Notes (Optional)</label>
        <textarea 
          id="notes" name="notes" rows={2}
          value={formData.notes} onChange={handleChange}
          className={`${inputClasses} resize-none`} placeholder="Dietary requirements, etc." disabled={isSubmitting}
        />
      </div>

      <div className="pt-2">
        <Button 
          type="submit" variant="primary" size="lg" fullWidth 
          isLoading={isSubmitting} className="h-12 text-base font-bold"
        >
          Confirm Booking
        </Button>
      </div>
    </form>
  );
}
