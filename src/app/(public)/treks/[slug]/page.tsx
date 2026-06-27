import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTrekBySlug, getRelatedTreks } from '@/lib/treks';
import { Container } from '@/components/layout/Container';
import { HeroGallery } from '@/components/trek/details/HeroGallery';
import { TrekOverview } from '@/components/trek/details/TrekOverview';
import { QuickFacts } from '@/components/trek/details/QuickFacts';
import { Highlights } from '@/components/trek/details/Highlights';
import { ItineraryTimeline } from '@/components/trek/details/ItineraryTimeline';
import { StickySidebar } from '@/components/trek/details/StickySidebar';
import { RelatedTreks } from '@/components/trek/details/RelatedTreks';

interface TrekDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrekDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) {
    return { title: 'Trek Not Found | TrekBazaar' };
  }

  return {
    title: `${trek.title} | TrekBazaar`,
    description: trek.description?.substring(0, 160) || `Experience the ${trek.title} trek in ${trek.region}.`,
  };
}

export default async function TrekDetailsPage({ params }: TrekDetailsPageProps) {
  // Next.js 15 requires awaiting params
  const { slug } = await params;
  
  const trek = await getTrekBySlug(slug);

  if (!trek) {
    notFound();
  }

  // Fetch related treks (cached automatically by the helper)
  const relatedTreks = await getRelatedTreks(trek);

  return (
    <>
      <main className="flex-1 w-full pb-12">
        <HeroGallery trek={trek} />
        
        <Container className="mt-8 md:mt-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content Area */}
            <div className="flex-1 w-full min-w-0 flex flex-col">
              <TrekOverview trek={trek} />
              <QuickFacts trek={trek} />
              <Highlights trek={trek} />
              <ItineraryTimeline trek={trek} />
            </div>
            
            {/* Sticky Sidebar Area */}
            <aside className="w-full lg:w-[380px] shrink-0">
              <StickySidebar trek={trek} />
            </aside>
          </div>
          
          {/* Related Treks Section */}
          <RelatedTreks treks={relatedTreks} />
        </Container>
      </main>
      
    </>
  );
}
