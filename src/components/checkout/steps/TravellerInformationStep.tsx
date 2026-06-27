"use client";

import React, { useState } from 'react';
import { useCheckout } from '../CheckoutContext';
import { motion } from 'framer-motion';

export function TravellerInformationStep() {
  const { step, setStep, formData, setFormData, selectedDeparture } = useCheckout();
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (step !== 2) return null;

  const availableSeats = selectedDeparture.total_seats - selectedDeparture.booked_seats;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'travellers') {
      const val = parseInt(value, 10);
      if (val > availableSeats || val < 1) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      setStep(3);
    }
  };

  const inputBase = "w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-tb-primary focus:border-tb-primary placeholder:text-zinc-400";

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Traveller Details</h2>
          <p className="text-zinc-500 mt-1">Please provide contact information for the primary traveller.</p>
        </div>
        <button onClick={() => setStep(1)} className="text-sm font-medium text-tb-primary hover:underline">
          Back
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Travellers Count (Prominent) */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <label className="block text-sm font-bold text-zinc-900 mb-2">Number of Travellers</label>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              name="travellers"
              min="1"
              max={availableSeats}
              value={formData.travellers}
              onChange={handleChange}
              className="w-24 rounded-lg border border-zinc-300 px-3 py-2 text-center font-bold text-lg focus:ring-2 focus:ring-tb-primary outline-none"
            />
            <span className="text-sm text-zinc-500">
              Maximum {availableSeats} seat{availableSeats !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className={`${inputBase} ${errors.name ? 'border-red-300 bg-red-50' : 'border-zinc-200 bg-white'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="jane@example.com"
                className={`${inputBase} ${errors.email ? 'border-red-300 bg-red-50' : 'border-zinc-200 bg-white'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Phone Number *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className={`${inputBase} ${errors.phone ? 'border-red-300 bg-red-50' : 'border-zinc-200 bg-white'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Special Requests (Optional)</label>
            <textarea 
              name="notes" 
              rows={3}
              value={formData.notes} 
              onChange={handleChange}
              placeholder="Dietary requirements, medical conditions, or any other notes..."
              className={`${inputBase} border-zinc-200 bg-white resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
        <button
          id="checkout-submit-btn"
          onClick={handleContinue}
          className="bg-tb-primary hover:bg-tb-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-tb-primary/20 transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          Review Booking
        </button>
      </div>
    </motion.div>
  );
}
