import React from 'react';
import { getMasterTrekPageData } from '@/lib/public/master-treks';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MasterTrekView } from '@/components/public/master-treks/MasterTrekView';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);
  
  if (!data || !data.masterTrek) {
    return { title: 'Trek Not Found' };
  }
  
  const mt = data.masterTrek;
  const title = mt.seo_title || `${mt.name} Trek Package & Itinerary`;
  const desc = mt.seo_description || mt.overview?.substring(0, 160) || `Book the ${mt.name} trek in the Himalayas. Compare verified operators and find best prices.`;
  
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `/master-treks/${slug}`,
      images: mt.cover_image ? [{ url: mt.cover_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: mt.cover_image ? [mt.cover_image] : [],
    }
  };
}

export default async function MasterTrekMarketplacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);

  if (!data || !data.masterTrek) {
    notFound();
  }

  return <MasterTrekView data={data} slug={slug} />;
}
