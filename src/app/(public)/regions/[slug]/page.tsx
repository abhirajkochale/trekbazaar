import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { getRegionBySlug } from '@/lib/treks';
import { searchMasterTreks } from '@/lib/search/master-api';
import { Container } from '@/components/layout/Container';
import { RegionHero } from '@/components/region/RegionHero';
import { RegionMainContent } from '@/components/region/RegionMainContent';
import { RegionSidebar } from '@/components/region/RegionSidebar';
import { RegionTreksGrid } from '@/components/region/RegionTreksGrid';
import { RegionFeaturedTreks } from '@/components/region/RegionFeaturedTreks';
import { RegionEmptyState } from '@/components/region/RegionEmptyState';

interface RegionDetailsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: RegionDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);

  if (!region) {
    return { title: 'Region Not Found | TrekBazaar' };
  }

  return {
    title: `Trekking in ${region.name} | TrekBazaar`,
    description: region.description?.substring(0, 160) || `Explore the best treks and adventures in ${region.name}.`,
    openGraph: {
      title: `Trekking in ${region.name} | TrekBazaar`,
      description: region.description?.substring(0, 160) || `Explore the best treks in ${region.name}.`,
      images: region.hero_image_url ? [region.hero_image_url] : [],
    }
  };
}

export default async function RegionDetailsPage({ params, searchParams }: RegionDetailsPageProps) {
  // Next.js 15 requires awaiting both params and searchParams
  const { slug } = await params;
  const sp = await searchParams;
  
  const region = await getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  // Parse URL search params safely
  const q = typeof sp.q === 'string' ? sp.q : undefined;
  const sort = typeof sp.sort === 'string' ? sp.sort as import('@/lib/search/master-api').MasterSearchFilters['sort'] : undefined;

  // Fetch master treks (Destinations) scoped specifically to this region's name
  const { masterTreks, totalCount } = await searchMasterTreks({
    q,
    sort,
    region: region.name,
    limit: 50 // Fetch all destinations for the region for now
  });

  // Check if there are no search filters applied
  const hasActiveFilters = Boolean(q || sort);
  const isCompletelyEmpty = totalCount === 0 && !hasActiveFilters;

  return (
    <>
      <main className="flex-1 w-full pb-20">
        <Script
          id={`breadcrumb-region-${region.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
                { "@type": "ListItem", "position": 2, "name": "Regions", "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/regions` },
                { "@type": "ListItem", "position": 3, "name": region.name, "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/regions/${slug}` }
              ]
            })
          }}
        />
        <RegionHero region={region} trekCount={totalCount} />
        
        <Container className="mt-8 md:mt-12">
          {isCompletelyEmpty ? (
            <RegionEmptyState />
          ) : (
            <>
              {!hasActiveFilters && <RegionFeaturedTreks treks={masterTreks} />}
              <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0 flex flex-col">
                  <RegionMainContent region={region} />
                  <RegionTreksGrid treks={masterTreks} totalCount={totalCount} />
                </div>
                
                {/* Sticky Sidebar Area */}
                <aside className="w-full lg:w-[360px] shrink-0 order-first lg:order-last">
                  <RegionSidebar region={region} treks={masterTreks} />
                </aside>
              </div>
            </>
          )}
        </Container>
      </main>
      
    </>
  );
}
