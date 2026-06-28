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

export default async function CompanyPublicProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

  // 2. Fetch Active Treks for this operator
  // First, get all master_trek_ids this company operates
  const { data: operatorTreks } = await supabase
    .from('treks')
    .select('master_trek_id')
    .eq('company_id', company.id)
    .eq('status', 'published');

  const masterTrekIds = Array.from(new Set(operatorTreks?.map(t => t.master_trek_id) || []));

  // Now fetch the rich master trek objects for the UI
  let activeMasterTreks = [];
  if (masterTrekIds.length > 0) {
    const { masterTreks } = await searchMasterTreks({ limit: 100 });
    activeMasterTreks = masterTreks.filter((mt: any) => masterTrekIds.includes(mt.id));
  }

  // 3. Fetch review stats (mocked for now as per instructions "if exists, else elegant placeholder")
  // Since we don't have a reviews table yet, we'll use a placeholder
  const totalReviews = 142; 

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <CompanyHero company={company} totalReviews={totalReviews} />

      {/* 2. Key Statistics */}
      <CompanyStats company={company} activeTreksCount={activeMasterTreks.length} />

      {/* 3. Company Overview */}
      <CompanyOverview company={company} />

      {/* 4. Active Treks (Reuses existing marketplace grid) */}
      <ActiveTreks treks={activeMasterTreks} />

      {/* 5. Why Choose This Operator */}
      <TrustSection />

      {/* 6. Share Section */}
      <ShareOperator company={company} />
    </main>
  );
}
