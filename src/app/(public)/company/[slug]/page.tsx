import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CompanyHero } from '@/components/company-profile/CompanyHero';
import { CompanyOverview } from '@/components/company-profile/CompanyOverview';
import { CompanyStats } from '@/components/company-profile/CompanyStats';
import { TrustSection } from '@/components/company-profile/TrustSection';
import { ShareOperator } from '@/components/company-profile/ShareOperator';
import { ActiveTreks } from '@/components/company-profile/ActiveTreks';
import { searchMasterTreks } from '@/lib/search/master-api';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (!company) {
    return { title: 'Company Not Found' };
  }
  
  const title = `${company.name} | Verified Himalayan Trekking Operator`;
  const desc = company.description?.substring(0, 160) || `Book your next Himalayan trek with ${company.name}. Compare itineraries, read reviews, and secure your spot on TrekBazaar.`;
  
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'profile',
      url: `/company/${slug}`,
      images: company.logo_url ? [{ url: company.logo_url, width: 800, height: 800 }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description: desc,
      images: company.logo_url ? [company.logo_url] : [],
    }
  };
}

export default async function CompanyPublicProfile({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!company) {
    notFound();
  }

  // 2. Fetch all unique master_trek_ids operated by this company (active treks)
  const { data: operatorTreks } = await supabase
    .from('treks')
    .select('id, master_trek_id')
    .eq('company_id', company.id)
    .eq('status', 'active'); // FIXED: 'active' instead of 'published'

  const masterTrekIds = Array.from(new Set(operatorTreks?.map(t => t.master_trek_id) || []));
  const trekIds = operatorTreks?.map(t => t.id) || [];

  // 3. Fetch departures to calculate accurate aggregate stats (without displaying them directly)
  // This aggregates 'Total Departures' across all active treks for this company
  let totalDepartures = 0;
  if (trekIds.length > 0) {
    const { count } = await supabase
      .from('departures')
      .select('id', { count: 'exact', head: true })
      .in('trek_id', trekIds)
      .in('status', ['Scheduled', 'Open', 'Guaranteed', 'Waitlisted']);
    totalDepartures = count || 0;
  }

  // 4. Fetch the rich master trek objects for the UI
  let activeMasterTreks = [];
  
  if (masterTrekIds.length > 0) {
    // We import parseSearchParams from wherever it exists or manually map them
    const filters: any = {};
    if (resolvedParams.difficulty) filters.difficulty = resolvedParams.difficulty as string;
    if (resolvedParams.region) filters.region = resolvedParams.region as string;
    if (resolvedParams.duration) filters.duration = parseInt(resolvedParams.duration as string);
    if (resolvedParams.season) filters.season = resolvedParams.season as string;
    if (resolvedParams.sort) filters.sort = resolvedParams.sort as string;
    
    // We set a high limit to get all company treks, then filter
    const { masterTreks } = await searchMasterTreks({ ...filters, limit: 100 });
    
    // Filter the marketplace results to ONLY show this company's treks
    activeMasterTreks = masterTreks.filter((mt: any) => masterTrekIds.includes(mt.id));
    
    // If the user hasn't explicitly sorted, we can provide a default sort here if needed
    // The marketplace default sort applies (highest rated / popular / cheapest)
  }

  // Calculate dynamic statistics
  const startingPrice = activeMasterTreks.length > 0 
    ? Math.min(...activeMasterTreks.map((mt: any) => mt.aggregated?.lowestPrice || 999999))
    : 0;

  const distinctRegions = new Set(activeMasterTreks.map((mt: any) => mt.region_name));
  
  // Real reviews placeholder (still mocked as per instructions if no DB table exists yet)
  const averageRating = 4.8;
  const totalReviews = 142; 

  const statsProps = {
    activeTreksCount: activeMasterTreks.length,
    totalDepartures: totalDepartures,
    startingPrice: startingPrice === 999999 ? null : startingPrice,
    regionsCovered: distinctRegions.size,
    establishedYear: company.established_year,
  };

  return (
    <main className="min-h-screen bg-white">
      <CompanyHero company={company} totalReviews={totalReviews} averageRating={averageRating} />

      <CompanyStats {...statsProps} />

      <CompanyOverview company={company} />

      <ActiveTreks treks={activeMasterTreks} companyName={company.name} />

      <TrustSection />

      <ShareOperator company={company} />
    </main>
  );
}
