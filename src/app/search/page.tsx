import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchLayout } from '@/components/search/SearchLayout';
import { ResultsGrid } from '@/components/search/ResultsGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Treks | TrekBazaar',
};

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <SearchHeader />
        <SearchLayout>
          <ResultsGrid />
          {/* Note: LoadingSkeleton and SearchEmptyState will be used here conditionally in the future. */}
        </SearchLayout>
      </main>
      <Footer />
    </div>
  );
}
