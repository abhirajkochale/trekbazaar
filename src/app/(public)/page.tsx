import { searchMasterTreks } from "@/lib/search/master-api";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickFilters } from "@/components/home/QuickFilters";
import { ValuePropSection } from "@/components/home/ValuePropSection";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
import { PersonalizedHome } from "@/components/home/PersonalizedHome";
import { TrekGridSection } from "@/components/home/TrekGridSection";
import { RegionBentoGrid } from "@/components/home/RegionBentoGrid";
import { CuratedCollections } from "@/components/home/CuratedCollections";
import { TrustedOperators } from "@/components/home/TrustedOperators";
import { MarketplaceGuarantee } from "@/components/home/MarketplaceGuarantee";
import { CTASection } from "@/components/home/CTASection";

export default async function Home() {
  const supabase = await createClient();

  // Fetch verified operators for the Trust Section
  const { data: verifiedOperators } = await supabase
    .from("companies")
    .select("*")
    .eq("verification_status", "verified")
    .limit(4);

  // Fetch a minimal set of treks (we significantly reduced the amount of data needed on the homepage)
  const { masterTreks } = await searchMasterTreks({ limit: 16 });

  const trendingTreks = masterTreks.slice(0, 8); // Top 8 newest/featured

  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Section 1: Hero & Discovery (Existing, recently polished) */}
        <HeroSection />
        <QuickFilters />
        
        {/* Section 2: Value Proposition (Replacing basic metrics with storytelling) */}
        <ValuePropSection />
        
        {/* Section 3: Cinematic Banner (Emotional anchor) */}
        <FeaturedBanner />
        
        {/* Section 4 & 5: High-Intent Treks (Personalized & Trending) */}
        <PersonalizedHome masterTreks={masterTreks} />
        {trendingTreks.length > 0 && (
          <TrekGridSection title="🔥 Popular Across Operators" subtitle="The most sought-after itineraries on our marketplace this week." treks={trendingTreks} />
        )}
        
        {/* Section 6: Explore by Region (Airbnb-style Bento Grid) */}
        <RegionBentoGrid />
        
        {/* Section 7: Curated Collections (Replaces 5 redundant carousels) */}
        <CuratedCollections />
        
        {/* Section 8: Trusted Operators */}
        <TrustedOperators companies={verifiedOperators || []} />
        
        {/* Section 9: Reviews (Omitted gracefully until DB supports it) */}
        
        {/* Section 10: Marketplace Guarantee (Apple-like trust anchor) */}
        <MarketplaceGuarantee />
        
        {/* Section 11: Final CTA */}
        <CTASection />
      </main>
    </>
  );
}
