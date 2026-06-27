"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Trek, Departure } from '@/lib/types';

interface FormData {
  name: string;
  email: string;
  phone: string;
  travellers: number;
  notes: string;
}

interface CheckoutContextType {
  step: number;
  setStep: (step: number) => void;
  trek: Trek;
  allDepartures: Departure[];
  selectedDeparture: Departure;
  setSelectedDeparture: (d: Departure) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  bookingRef: string | null;
  setBookingRef: (ref: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({
  children,
  trek,
  allDepartures,
  initialDeparture
}: {
  children: ReactNode;
  trek: Trek;
  allDepartures: Departure[];
  initialDeparture: Departure;
}) {
  const [step, setStep] = useState(1);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure>(initialDeparture);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    travellers: 1,
    notes: ''
  });

  return (
    <CheckoutContext.Provider
      value={{
        step,
        setStep,
        trek,
        allDepartures,
        selectedDeparture,
        setSelectedDeparture,
        formData,
        setFormData,
        bookingRef,
        setBookingRef,
        isSubmitting,
        setIsSubmitting
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
