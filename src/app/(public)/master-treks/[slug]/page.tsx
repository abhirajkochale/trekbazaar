import React from 'react';
import { getMasterTrekPageData } from '@/lib/public/master-treks';
import { notFound } from 'next/navigation';
import { HeroGallery } from '@/components/public/master-treks/HeroGallery';
import { StickySidebar } from '@/components/public/master-treks/StickySidebar';
import { MobileStickyCTA } from '@/components/public/master-treks/MobileStickyCTA';
import { StickyNav } from '@/components/public/master-treks/StickyNav';
import { QuickFacts } from '@/components/public/master-treks/QuickFacts';
import nextDynamic from 'next/dynamic';

const MarketplaceSection = nextDynamic(() => import('@/components/public/master-treks/MarketplaceSection').then(mod => mod.MarketplaceSection));
const DepartureCalendar = nextDynamic(() => import('@/components/public/master-treks/DepartureCalendar').then(mod => mod.DepartureCalendar));
const ItineraryTimeline = nextDynamic(() => import('@/components/public/master-treks/ItineraryTimeline').then(mod => mod.ItineraryTimeline));
const InclusionsExclusions = nextDynamic(() => import('@/components/public/master-treks/InclusionsExclusions').then(mod => mod.InclusionsExclusions));
const SimilarTreks = nextDynamic(() => import('@/components/public/master-treks/SimilarTreks').then(mod => mod.SimilarTreks));

export const dynamic = "force-dynamic";

export default async function MasterTrekMarketplacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);

  if (!data || !data.masterTrek) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-24 lg:pb-12">
      <HeroGallery masterTrek={data.masterTrek} />
      
      {/* Sticky Navigation Tabs */}
      <StickyNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Content (Left Column) */}
          <div className="flex-1 w-full space-y-24">
            
            {/* Overview Section */}
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

            {/* Operator Comparison Section */}
            <section id="operators" className="scroll-mt-32">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">Compare Operators</h2>
                <p className="text-zinc-500 mt-2 text-lg">
                  Choose from {data.packages.length} verified operators offering this trek.
                </p>
              </div>
              <MarketplaceSection packages={data.packages} />
            </section>
            
            {/* Calendar Section */}
            <section id="departures" className="scroll-mt-32">
              <DepartureCalendar allDepartures={data.allDepartures} />
            </section>

            {/* Itinerary Section */}
            <section id="itinerary" className="scroll-mt-32">
              <ItineraryTimeline packages={data.packages} />
            </section>

            {/* Inclusions Section */}
            <section id="inclusions" className="scroll-mt-32">
              <InclusionsExclusions inclusions={data.allInclusions} exclusions={data.allExclusions} />
            </section>

            {/* Similar Treks Section */}
            <section className="scroll-mt-32 pt-12 border-t border-zinc-200">
              <SimilarTreks similarTreks={data.similarTreks || []} />
            </section>
            
          </div>
          
          {/* Sticky Sidebar (Right Column) */}
          <div className="hidden lg:block w-[360px] shrink-0">
            <StickySidebar 
              masterTrek={data.masterTrek} 
              packages={data.packages} 
              allDepartures={data.allDepartures} 
            />
          </div>
          
        </div>
      </div>
      
      {/* Mobile Bottom Bar */}
      <MobileStickyCTA packages={data.packages} />
    </main>
  );
}
