import React from 'react';
import { getMasterTrekPageData } from '@/lib/public/master-treks';
import { notFound } from 'next/navigation';
import { MasterTrekHero } from '@/components/public/master-treks/MasterTrekHero';
import { MarketplaceSummaryBar } from '@/components/public/master-treks/MarketplaceSummaryBar';
import { MarketplaceSection } from '@/components/public/master-treks/MarketplaceSection';

export const dynamic = "force-dynamic";

export default async function MasterTrekMarketplacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMasterTrekPageData(slug);

  if (!data || !data.masterTrek) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <MasterTrekHero masterTrek={data.masterTrek} packages={data.packages} />
      <MarketplaceSummaryBar packages={data.packages} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-tb-text-primary">Compare Operator Packages</h2>
          <p className="text-tb-text-secondary mt-2 text-lg">
            Compare prices, dates, and inclusions across verified local experts.
          </p>
        </div>

        <MarketplaceSection packages={data.packages} />
      </div>
    </main>
  );
}
