import React, { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/public/companies/HeroSection';
import { CompanyFilters } from '@/components/public/companies/CompanyFilters';
import { CompanyGrid } from '@/components/public/companies/CompanyGrid';
import Link from 'next/link';

export const metadata = {
  title: 'Explore Trekking Companies | TrekBazaar',
  description: 'Discover and compare India’s best trekking operators. Find verified partners, browse active treks, and book with confidence on TrekBazaar.',
};

export default async function CompaniesDirectoryPage(props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex flex-col min-h-screen pt-20 pb-20 bg-zinc-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
             <CompanyFilters />
          </div>
          
          {/* Main Grid */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-tb-primary border-t-transparent rounded-full animate-spin"></div></div>}>
              <CompanyGrid searchParams={searchParams} />
            </Suspense>
            
            {/* Become a Partner CTA */}
            <div className="mt-16 bg-white rounded-3xl p-10 border border-zinc-200 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-tb-primary to-tb-secondary" />
              <h3 className="text-2xl font-black text-zinc-900 mb-4">Are you a trekking operator?</h3>
              <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
                Join India's fastest-growing trekking marketplace. Get more bookings, manage departures, and grow your business.
              </p>
              <Link 
                href="/partner"
                className="inline-flex items-center justify-center px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Become a Partner Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
