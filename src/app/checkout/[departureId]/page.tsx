import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CheckoutProvider } from '@/components/checkout/CheckoutContext';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutSidebar } from '@/components/checkout/CheckoutSidebar';
import { MobileBottomSummary } from '@/components/checkout/MobileBottomSummary';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';

// Steps
import { DepartureSelectionStep } from '@/components/checkout/steps/DepartureSelectionStep';
import { TravellerInformationStep } from '@/components/checkout/steps/TravellerInformationStep';
import { BookingReviewStep } from '@/components/checkout/steps/BookingReviewStep';
import { PaymentPlaceholderStep } from '@/components/checkout/steps/PaymentPlaceholderStep';
import { BookingSuccessStep } from '@/components/checkout/steps/BookingSuccessStep';

interface PageProps {
  params: Promise<{ departureId: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { departureId } = await params;
  
  const supabase = await createClient();

  // 1. Fetch the specific departure first to get the trek_id
  const { data: initialDeparture, error: depError } = await supabase
    .from('departures')
    .select('*')
    .eq('id', departureId)
    .single();

  if (depError || !initialDeparture) {
    notFound();
  }

  // 2. Fetch the trek and all active departures
  const { data: trek, error: trekError } = await supabase
    .from('treks')
    .select(`
      *,
      companies(id, name, logo_url, verification_status, years_of_experience),
      departures(*)
    `)
    .eq('id', initialDeparture.trek_id)
    .single();

  if (trekError || !trek) {
    notFound();
  }

  // 3. Filter and sort active departures
  const allDepartures = (trek.departures || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((d: any) => d.is_active && d.status !== 'Cancelled' && d.status !== 'Completed')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());

  return (
    <CheckoutProvider 
      trek={trek} 
      allDepartures={allDepartures} 
      initialDeparture={initialDeparture}
    >
      <div className="min-h-screen bg-tb-sys-background flex flex-col pb-24 lg:pb-0">
        <CheckoutHeader />
        
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Form Steps */}
            <div className="flex-1 w-full max-w-[700px]">
              <CheckoutProgress />
              
              <div className="mt-8 bg-white rounded-2xl border border-tb-border shadow-tb-subtle overflow-hidden">
                <DepartureSelectionStep />
                <TravellerInformationStep />
                <BookingReviewStep />
                <PaymentPlaceholderStep />
                <BookingSuccessStep />
              </div>
            </div>
            
            {/* Right Column: Sticky Summary */}
            <div className="hidden lg:block w-[400px] shrink-0">
              <CheckoutSidebar />
            </div>
            
          </div>
        </main>

        <MobileBottomSummary />
      </div>
    </CheckoutProvider>
  );
}
