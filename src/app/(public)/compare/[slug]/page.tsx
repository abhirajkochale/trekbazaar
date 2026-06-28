import React from 'react';
import { getMasterTrekPageData } from '@/lib/public/master-treks';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CompareEngine } from '@/components/public/compare/CompareEngine';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);
  
  if (!data || !data.masterTrek) {
    return { title: 'Trek Not Found' };
  }
  
  const mt = data.masterTrek;
  const title = `Compare ${mt.name} Trek Packages Across Verified Operators`;
  const desc = `Compare prices, itineraries, and inclusions for the ${mt.name} trek side-by-side. Find the best value verified operator on TrekBazaar.`;
  
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `/compare/${slug}`,
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

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);

  if (!data || !data.masterTrek) {
    notFound();
  }

  // Pass data to the Client Component
  return (
    <div className="pt-20">
      <CompareEngine masterTrek={data.masterTrek} packages={data.packages} />
    </div>
  );
}
