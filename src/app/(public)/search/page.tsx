import React from 'react';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchLayout } from '@/components/search/SearchLayout';
import { SearchEmptyState } from '@/components/search/SearchEmptyState';
import { searchMasterTreks } from '@/lib/search/master-api';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';
import { Metadata } from 'next';
import Script from 'next/script';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const title = q ? `Search Results for "${q}" | TrekBazaar` : 'Search Treks | TrekBazaar';
  
  return {
    title,
    description: `Browse and compare verified trekking packages in the Himalayas. ${q ? `Showing results for ${q}.` : ''}`,
    openGraph: {
      title,
      description: `Browse and compare verified trekking packages. ${q ? `Showing results for ${q}.` : ''}`,
      url: `/search?q=${q}`,
    },
  };
}

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Next.js 15 requires awaiting searchParams
  const params = await searchParams;
  
  // Extract all relevant filter parameters
  const q = typeof params.q === 'string' ? params.q : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const region = typeof params.region === 'string' ? params.region : undefined;
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : undefined;
  const duration = typeof params.duration === 'string' ? parseInt(params.duration, 10) : undefined;
  const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice, 10) : undefined;
  const sort = typeof params.sort === 'string' ? params.sort as import('@/lib/search/master-api').MasterSearchFilters['sort'] : undefined;

  // Fetch production data
  const { masterTreks, totalCount } = await searchMasterTreks({ 
    q, 
    page, 
    region, 
    difficulty, 
    duration, 
    minPrice, 
    maxPrice,
    sort
  });

  return (
    <>
      <main className="flex-1 flex flex-col">
        <Script
          id="breadcrumb-search"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
                { "@type": "ListItem", "position": 2, "name": "Search Treks", "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search` }
              ]
            })
          }}
        />
        <SearchHeader totalCount={totalCount} />
        <SearchLayout>
          {masterTreks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {masterTreks.map((mt: any) => (
                <MasterTrekSearchCard key={mt.id} masterTrek={mt} />
              ))}
            </div>
          ) : (
            <SearchEmptyState />
          )}
        </SearchLayout>
      </main>
    </>
  );
}
