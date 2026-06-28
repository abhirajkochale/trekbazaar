import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CompanyHeroMicrosite } from '@/components/company-profile/CompanyHeroMicrosite';
import { CompanyUpcomingWeekend } from '@/components/company-profile/CompanyUpcomingWeekend';
import { CompanyDepartures } from '@/components/company-profile/CompanyDepartures';
import { CompanyStory } from '@/components/company-profile/CompanyStory';
import { TrekGridSection } from '@/components/home/TrekGridSection';
import { CompanyGallery } from '@/components/company-profile/CompanyGallery';
import { CompanyRegions } from '@/components/company-profile/CompanyRegions';
import { CompanyWhyUs } from '@/components/company-profile/CompanyWhyUs';
import { CompanyReviews } from '@/components/company-profile/CompanyReviews';
import { CompanyFAQ } from '@/components/company-profile/CompanyFAQ';
import { CompanyContact } from '@/components/company-profile/CompanyContact';
import { ShareOperator } from '@/components/company-profile/ShareOperator';
import { MorePartners } from '@/components/company-profile/MorePartners';
import { BecomePartnerCTA } from '@/components/company-profile/BecomePartnerCTA';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: company } = await supabase
    .from('companies')
    .select('name, description, logo_url, cover_image_url')
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
      images: company.cover_image_url ? [{ url: company.cover_image_url, width: 1200, height: 630 }] : (company.logo_url ? [{ url: company.logo_url, width: 800, height: 800 }] : []),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: company.cover_image_url ? [company.cover_image_url] : (company.logo_url ? [company.logo_url] : []),
    }
  };
}

export default async function CompanyPublicProfile({ 
  params,
}: { 
  params: Promise<{ slug: string }>,
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // QUERY 1: Fetch Company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!company) {
    notFound();
  }

  // QUERY 2: Fetch all active treks with their departures and master trek details
  const { data: treks } = await supabase
    .from('treks')
    .select(`
      *,
      departures(id, departure_date, return_date, base_price, offer_price, total_seats, booked_seats, status),
      master_treks(*)
    `)
    .eq('company_id', company.id)
    .eq('status', 'active');

  // QUERY 3: Fetch more verified partners
  const { data: partners } = await supabase
    .from('companies')
    .select('id, name, slug, logo_url, cover_image_url, approval_status')
    .eq('status', 'active')
    .neq('id', company.id)
    .limit(6);

  // --- DYNAMIC CALCULATIONS ---
  const activeTreks = treks || [];
  
  // Aggregate all future departures
  const now = new Date();
  let allDepartures: any[] = [];
  let lowestPrice = Infinity;
  let highestRating = 0;
  const regionsCovered = new Set<string>();
  const categoriesCovered = new Set<string>();
  let totalDuration = 0;

  activeTreks.forEach((trek: any) => {
    // Collect regions
    if (trek.master_treks?.region_id) regionsCovered.add(trek.master_treks.region_id);
    if (trek.master_treks?.category_id) categoriesCovered.add(trek.master_treks.category_id);
    
    // Duration
    totalDuration += trek.duration_days || 0;

    // Highest Rated logic (mocked logic based on price for now since we don't have reviews attached to treks directly)
    if ((trek.master_treks?.reviews_count || 0) > highestRating) {
      highestRating = trek.master_treks?.reviews_count;
    }

    if (trek.departures && Array.isArray(trek.departures)) {
      trek.departures.forEach((dep: any) => {
        const depDate = new Date(dep.departure_date);
        if (depDate > now && ['Scheduled', 'Open', 'Guaranteed', 'Waitlisted'].includes(dep.status)) {
          // Attach trek info to departure for cards
          const enhancedDep = {
            ...dep,
            treks: {
              title: trek.title,
              slug: trek.slug,
              master_trek: trek.master_treks
            }
          };
          allDepartures.push(enhancedDep);

          const price = dep.offer_price || dep.base_price;
          if (price < lowestPrice) lowestPrice = price;
        }
      });
    } else {
      // If no departures but trek has a base price
      if (trek.price_per_person < lowestPrice) lowestPrice = trek.price_per_person;
    }
  });

  // Sort departures chronologically
  allDepartures.sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());

  // Calculations
  const totalActiveTreksCount = activeTreks.length;
  const upcomingDeparturesCount = allDepartures.length;
  const avgDuration = totalActiveTreksCount > 0 ? Math.round(totalDuration / totalActiveTreksCount) : 0;
  const finalLowestPrice = lowestPrice === Infinity ? null : lowestPrice;
  
  // Find Weekend Departures (Upcoming Saturday/Sunday)
  const weekendDepartures = allDepartures.filter(dep => {
    const d = new Date(dep.departure_date);
    const day = d.getDay();
    // 6 = Saturday, 0 = Sunday
    if (day === 6 || day === 0) {
      // Ensure it's within the next 14 days to be relevant
      const diffTime = Math.abs(d.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 14;
    }
    return false;
  }).slice(0, 4);

  // Gallery Data
  const companyImages = [company.cover_image_url, company.logo_url].filter(Boolean);
  const trekImages = activeTreks.map((t: any) => t.cover_image_url || t.master_treks?.cover_image).filter(Boolean);
  const trekGalleries = activeTreks.flatMap((t: any) => t.gallery || t.master_treks?.gallery || []).filter(Boolean);
  const rawGallery = [...companyImages, ...trekImages, ...trekGalleries];
  const gallery = Array.from(new Set(rawGallery)).slice(0, 12); // Unique images, max 12

  // Transform active treks for the TrekGridSection (it expects standard master trek format with minPrice)
  const gridTreks = activeTreks.map((trek: any) => ({
    id: trek.id,
    name: trek.title || trek.master_treks?.name,
    slug: trek.slug, // IMPORTANT: The dynamic route needs the company slug + trek slug. Wait, TrekGridSection points to `/master-treks/[slug]`. We must override the URL or reuse it if it supports company slug.
    cover_image: trek.cover_image_url || trek.master_treks?.cover_image,
    duration_min: trek.duration_days,
    difficulty: trek.difficulty,
    region: { name: trek.region || trek.master_treks?.region?.name || 'Himalayas' }, // Mocked region name if deep join fails
    aggregated: {
      lowestPrice: trek.price_per_person
    },
    // We pass company_slug to tell TrekGridSection to link to /company/[slug]/[trekSlug]
    company_slug: company.slug
  }));

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* 1. Hero */}
      <CompanyHeroMicrosite 
        company={company} 
        stats={{
          totalActiveTreks: totalActiveTreksCount,
          upcomingDepartures: upcomingDeparturesCount,
          lowestPrice: finalLowestPrice
        }}
      />

      {/* 2. Upcoming This Weekend */}
      <CompanyUpcomingWeekend departures={weekendDepartures} companySlug={company.slug} />

      {/* 3. Upcoming Departures */}
      <CompanyDepartures departures={allDepartures} companySlug={company.slug} />

      {/* 4. Our Story */}
      <CompanyStory company={company} />

      {/* 5. All Treks */}
      {gridTreks.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">Our Treks</h2>
              <p className="text-zinc-500 mt-4 text-lg">Browse all {gridTreks.length} active treks offered by {company.name}</p>
            </div>
            <TrekGridSection title="Our Treks" treks={gridTreks} />
          </div>
        </section>
      )}

      {/* 6. Photo Gallery */}
      <CompanyGallery images={gallery} companyName={company.name} />

      {/* 7. Operating In */}
      <CompanyRegions regionsCovered={Array.from(regionsCovered)} />

      {/* 8. Why Trek With Us */}
      <CompanyWhyUs company={company} />

      {/* 9. Reviews */}
      <CompanyReviews company={company} />

      {/* 10. FAQ */}
      <CompanyFAQ company={company} />

      {/* 11. Contact */}
      <CompanyContact company={company} />

      {/* 12. Share Company */}
      <ShareOperator company={company} />

      {/* 13. More Verified Partners */}
      <MorePartners partners={partners || []} />

      {/* 14. Become a Partner CTA */}
      <BecomePartnerCTA />
    </main>
  );
}
