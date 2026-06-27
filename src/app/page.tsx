import { searchMasterTreks } from "@/lib/search/master-api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustMetrics } from "@/components/home/TrustMetrics";
import { TrekGridSection } from "@/components/home/TrekGridSection";
import { CTASection } from "@/components/home/CTASection";

export default async function Home() {
  const { masterTreks } = await searchMasterTreks({ limit: 100 });

  // Categorize for sections:
  const trendingTreks = masterTreks.slice(0, 4); // First 4
  const popularTreks = [...masterTreks].sort((a,b) => b.aggregated.companiesCount - a.aggregated.companiesCount).slice(0, 4);
  const beginnerTreks = masterTreks.filter(t => t.difficulty?.toLowerCase() === 'easy' || t.difficulty?.toLowerCase() === 'moderate').slice(0, 4);
  const winterTreks = masterTreks.filter(t => t.category?.name?.toLowerCase().includes('winter')).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection masterTreks={masterTreks} />
        <TrustMetrics />
        <TrekGridSection title="🔥 Trending Treks" subtitle="The most sought-after adventures this week." treks={trendingTreks} />
        <TrekGridSection title="⭐ Most Popular" subtitle="Highly rated and trusted by thousands of trekkers." treks={popularTreks} />
        <TrekGridSection title="🧗 Beginner Friendly" subtitle="Perfect for your first Himalayan experience." treks={beginnerTreks} />
        <TrekGridSection title="❄️ Winter Treks" subtitle="Experience the magic of snow-covered peaks." treks={winterTreks} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
