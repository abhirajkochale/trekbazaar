import { searchMasterTreks } from "@/lib/search/master-api";
import { getPublicCompanies, getPublicMarketplaceStats } from "@/lib/public/companies";
import { getPublicCategories } from "@/lib/public/categories";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickFilters } from "@/components/home/QuickFilters";
import { MarketplaceMetrics } from "@/components/home/MarketplaceMetrics";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
import { PersonalizedHome } from "@/components/home/PersonalizedHome";
import { TrekGridSection } from "@/components/home/TrekGridSection";
import { RegionBentoGrid } from "@/components/home/RegionBentoGrid";
import { CuratedCollections } from "@/components/home/CuratedCollections";
import { TrustedOperators } from "@/components/home/TrustedOperators";
import { MarketplaceGuarantee } from "@/components/home/MarketplaceGuarantee";
import { CTASection } from "@/components/home/CTASection";

export default async function Home() {
  // Fetch marketplace metrics dynamically
  const metrics = await getPublicMarketplaceStats();

  // Fetch verified operators for the Trust Section
  const verifiedOperators = await getPublicCompanies({ limit: 4 });

  // Fetch a minimal set of treks (we significantly reduced the amount of data needed on the homepage)
  const { masterTreks } = await searchMasterTreks({ limit: 16 });

  const trendingTreks = masterTreks.slice(0, 8); // Top 8 newest/featured
  
  const categories = await getPublicCategories();

  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* Section 1: Hero & Discovery (Existing, recently polished) */}
        <HeroSection />
        <QuickFilters categories={categories} />
        
        {/* Section 2: Marketplace Metrics (Replacing static Value Prop) */}
        <MarketplaceMetrics metrics={metrics} />
        
        {/* Section 3: Cinematic Banner (Emotional anchor) */}
        <FeaturedBanner />
        
        {/* Section 4 & 5: High-Intent Treks (Personalized & Trending) */}
        <PersonalizedHome masterTreks={masterTreks} />
        {trendingTreks.length > 0 && (
          <TrekGridSection title="Popular Across Operators" subtitle="The most sought-after itineraries on our marketplace this week." treks={trendingTreks} />
        )}
        
        {/* Section 6: Explore by Region (Airbnb-style Bento Grid) */}
        <RegionBentoGrid />
        
        {/* Section 7: Curated Collections (Replaces 5 redundant carousels) */}
        <CuratedCollections />
        
        {/* Section 8: Explore Trekking Companies */}
        <TrustedOperators companies={verifiedOperators.slice(0, 4)} />
        
        {/* Section 9: Reviews (Omitted gracefully until DB supports it) */}
        
        {/* Section 10: Marketplace Guarantee (Apple-like trust anchor) */}
        <MarketplaceGuarantee />
        
        {/* Section 11: Final CTA */}
        <CTASection />
      </main>
    </>
  );
}
