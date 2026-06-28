"use client";

import React from 'react';
import { HeroGallery } from '@/components/public/master-treks/HeroGallery';
import { ViewTracker } from '@/components/public/master-treks/ViewTracker';
import { StickySidebar } from '@/components/public/master-treks/StickySidebar';
import { MobileStickyCTA } from '@/components/public/master-treks/MobileStickyCTA';
import { StickyNav } from '@/components/public/master-treks/StickyNav';
import { QuickFacts } from '@/components/public/master-treks/QuickFacts';
import { MarketplaceSection } from '@/components/public/master-treks/MarketplaceSection';
import { DepartureCalendar } from '@/components/public/master-treks/DepartureCalendar';
import { ItineraryTimeline } from '@/components/public/master-treks/ItineraryTimeline';
import { InclusionsExclusions } from '@/components/public/master-treks/InclusionsExclusions';
import { SimilarTreks } from '@/components/public/master-treks/SimilarTreks';
import Script from 'next/script';

interface MasterTrekViewProps {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    masterTrek: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    packages: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allDepartures: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allInclusions: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allExclusions: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    similarTreks: any[];
  };
  slug: string;
  companySlug?: string; // If present, adapts the UI for a single operator
}

export function MasterTrekView({ data, slug, companySlug }: MasterTrekViewProps) {
  const isSingleOperator = !!companySlug;
  const operatorName = isSingleOperator && data.packages.length > 0 ? data.packages[0].companies?.name : null;

  return (
    <main className="min-h-screen bg-zinc-50 pb-24 lg:pb-12">
      <Script
        id={`json-ld-${data.masterTrek.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${data.masterTrek.name} Trek`,
            image: data.masterTrek.cover_image,
            description: data.masterTrek.seo_description || data.masterTrek.overview?.substring(0, 160),
            offers: {
              "@type": "AggregateOffer",
              offerCount: data.packages.length,
              lowPrice: data.masterTrek.aggregated?.lowestPrice || 0,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: Math.max(10, data.packages.length * 5)
            }
          })
        }}
      />
      <Script
        id={`breadcrumb-${data.masterTrek.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
              { "@type": "ListItem", "position": 2, "name": "Treks", "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search` },
              { "@type": "ListItem", "position": 3, "name": data.masterTrek.name, "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/master-treks/${slug}` }
            ]
          })
        }}
      />
      <ViewTracker id={data.masterTrek.id} />
      <HeroGallery masterTrek={data.masterTrek} />
      
      <StickyNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="flex-1 w-full space-y-24">
            
            <section id="overview" className="scroll-mt-32 space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">About {data.masterTrek.name}</h2>
              </div>
              <QuickFacts masterTrek={data.masterTrek} />
              
              {data.masterTrek.overview && (
                <div className="prose prose-zinc max-w-none text-lg text-zinc-600 leading-relaxed font-medium">
                  {data.masterTrek.overview.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </section>

            <section id="operators" className="scroll-mt-32">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">
                  {isSingleOperator ? `About the Operator` : `Compare Operators`}
                </h2>
                {!isSingleOperator && (
                  <p className="text-zinc-500 mt-2 text-lg">
                    Choose from {data.packages.length} verified operators offering this trek.
                  </p>
                )}
              </div>
              <MarketplaceSection packages={data.packages} />
            </section>
            
            <section id="departures" className="scroll-mt-32">
              <DepartureCalendar allDepartures={data.allDepartures} />
            </section>

            <section id="itinerary" className="scroll-mt-32">
              <ItineraryTimeline packages={data.packages} />
            </section>

            <section id="inclusions" className="scroll-mt-32">
              <InclusionsExclusions inclusions={data.allInclusions} exclusions={data.allExclusions} />
            </section>

            {!isSingleOperator && (
              <section className="scroll-mt-32 pt-12 border-t border-zinc-200">
                <SimilarTreks similarTreks={data.similarTreks || []} />
              </section>
            )}
            
          </div>
          
          <div className="hidden lg:block w-[360px] shrink-0">
            <StickySidebar 
              masterTrek={data.masterTrek} 
              packages={data.packages} 
              allDepartures={data.allDepartures} 
              isSingleOperator={isSingleOperator}
            />
          </div>
          
        </div>
      </div>
      
      <MobileStickyCTA packages={data.packages} />
    </main>
  );
}
