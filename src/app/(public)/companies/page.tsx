import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/public/companies/HeroSection';

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
             {/* <CompanyFilters /> */}
          </div>
          
          {/* Main Grid */}
          <div className="flex-1 min-w-0">
            {/* <CompanyGrid searchParams={searchParams} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
