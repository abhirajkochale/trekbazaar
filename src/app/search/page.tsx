import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchLayout } from '@/components/search/SearchLayout';
import { ResultsGrid } from '@/components/search/ResultsGrid';
import { SearchEmptyState } from '@/components/search/SearchEmptyState';
import { searchTreks } from '@/lib/search/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Treks | TrekBazaar',
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Next.js 15 requires awaiting searchParams
  const params = await searchParams;
  
  // Extract only q and page for now
  const q = typeof params.q === 'string' ? params.q : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;

  // Fetch production data
  const { treks, totalCount } = await searchTreks({ q, page });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <SearchHeader totalCount={totalCount} initialQuery={q} />
        <SearchLayout>
          {treks.length > 0 ? (
            <ResultsGrid treks={treks} />
          ) : (
            <SearchEmptyState />
          )}
        </SearchLayout>
      </main>
      <Footer />
    </div>
  );
}
