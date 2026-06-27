"use client";

import React from 'react';
import { useCheckout } from './CheckoutContext';
import { Check } from 'lucide-react';

export function CheckoutProgress() {
  const { step } = useCheckout();
  
  if (step === 5) return null; // hide on success

  const steps = [
    { num: 1, label: "Departure" },
    { num: 2, label: "Traveller Details" },
    { num: 3, label: "Review" },
    { num: 4, label: "Payment" }
  ];

  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex items-center justify-between relative z-10 px-2 sm:px-4">
        {steps.map((s) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div key={s.num} className="flex flex-col items-center bg-tb-sys-background px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-300 ${
                isActive ? "bg-tb-primary text-white shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" :
                isCompleted ? "bg-tb-primary text-white" :
                "bg-zinc-200 text-zinc-500"
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide text-center transition-colors ${
                isActive ? 'text-tb-primary' : 
                isCompleted ? 'text-zinc-800' : 'text-zinc-400'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress Bar Line */}
      <div className="relative -mt-8 sm:-mt-9 h-1 bg-zinc-200 rounded-full mx-6 sm:mx-10 z-0">
        <div 
          className="absolute top-0 left-0 h-full bg-tb-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((Math.min(step, 4) - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="h-8 sm:h-9" /> {/* Spacer */}
    </div>
  );
}
