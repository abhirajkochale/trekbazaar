import React from 'react';
import { getMasterTrekPageData } from '@/lib/public/master-treks';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MasterTrekView } from '@/components/public/master-treks/MasterTrekView';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, trekSlug: string }> }): Promise<Metadata> {
  const { slug, trekSlug } = await params;
  const companySlug = slug;
  const data = await getMasterTrekPageData(trekSlug, companySlug);
  
  if (!data || !data.masterTrek || data.packages.length === 0) {
    return { title: 'Trek Not Found' };
  }
  
  const mt = data.masterTrek;
  const operatorName = data.packages[0].companies?.name || companySlug;
  const title = `${mt.name} Trek by ${operatorName} | Book Online`;
  const desc = `Book the ${mt.name} trek with ${operatorName}. Check upcoming departures, pricing, and itinerary exclusively on TrekBazaar.`;
  
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `/company/${companySlug}/${trekSlug}`,
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

export default async function CompanyTrekPage({ params }: { params: Promise<{ slug: string, trekSlug: string }> }) {
  const { slug, trekSlug } = await params;
  const companySlug = slug;
  const data = await getMasterTrekPageData(trekSlug, companySlug);

  if (!data || !data.masterTrek || data.packages.length === 0) {
    notFound();
  }

  return <MasterTrekView data={data} slug={trekSlug} companySlug={companySlug} />;
}
