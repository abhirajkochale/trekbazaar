import { searchMasterTreks } from "@/lib/search/master-api";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustMetrics } from "@/components/home/TrustMetrics";
import { TrekGridSection } from "@/components/home/TrekGridSection";
import { CTASection } from "@/components/home/CTASection";

export default async function Home() {
  const supabase = await createClient();

  // Fetch real counts for TrustMetrics
  const [{ count: operatorsCount }, { count: departuresCount }, { count: destinationsCount }] = await Promise.all([
    supabase.from("companies").select("*", { count: 'exact', head: true }).eq("verification_status", "verified"),
    supabase.from("departures").select("*", { count: 'exact', head: true }).eq("status", "Upcoming"),
    supabase.from("regions").select("*", { count: 'exact', head: true })
  ]);

  const { masterTreks } = await searchMasterTreks({ limit: 100 });

  // Categorize for sections (ensure no duplicates within the same visual context if possible, but for carousels it's okay if they are in different categories)
  const trendingTreks = masterTreks.slice(0, 8); // Top 8 newest/featured
  
  // Popular: most companies operating
  const popularTreks = [...masterTreks].sort((a,b) => b.aggregated.companiesCount - a.aggregated.companiesCount).slice(0, 8);
  
  // Beginner: Easy/Moderate
  const beginnerTreks = masterTreks.filter(t => t.difficulty?.toLowerCase() === 'easy' || t.difficulty?.toLowerCase() === 'moderate').slice(0, 8);
  
  // High Altitude: Difficult/Extreme
  const highAltitudeTreks = masterTreks.filter(t => t.difficulty?.toLowerCase() === 'difficult' || t.difficulty?.toLowerCase() === 'extreme').slice(0, 8);
  
  // Budget: Lowest price < 12000
  const budgetTreks = masterTreks.filter(t => t.aggregated.lowestPrice > 0 && t.aggregated.lowestPrice < 12000).slice(0, 8);

  // Winter: Winter category
  const winterTreks = masterTreks.filter(t => t.category?.name?.toLowerCase().includes('winter')).slice(0, 8);
  
  // Weekend: <= 4 days
  const weekendTreks = masterTreks.filter(t => t.duration_max <= 4).slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection masterTreks={masterTreks} />
        
        <TrustMetrics 
          operatorsCount={operatorsCount || 20} 
          departuresCount={departuresCount || 100} 
          destinationsCount={destinationsCount || 5} 
        />
        
        {trendingTreks.length > 0 && (
          <TrekGridSection title="🔥 Trending Treks" subtitle="The most sought-after adventures this week." treks={trendingTreks} />
        )}
        
        {popularTreks.length > 0 && (
          <TrekGridSection title="⭐ Most Popular" subtitle="Highly rated and trusted by thousands of trekkers." treks={popularTreks} />
        )}
        
        {budgetTreks.length > 0 && (
          <TrekGridSection title="💰 Budget Treks" subtitle="Amazing experiences that won't break the bank." treks={budgetTreks} />
        )}

        {weekendTreks.length > 0 && (
          <TrekGridSection title="🏕️ Weekend Treks" subtitle="Quick getaways for your busy schedule." treks={weekendTreks} />
        )}
        
        {beginnerTreks.length > 0 && (
          <TrekGridSection title="🧗 Beginner Friendly" subtitle="Perfect for your first Himalayan experience." treks={beginnerTreks} />
        )}
        
        {highAltitudeTreks.length > 0 && (
          <TrekGridSection title="🏔️ High Altitude" subtitle="Challenge yourself on extreme peaks." treks={highAltitudeTreks} />
        )}
        
        {winterTreks.length > 0 && (
          <TrekGridSection title="❄️ Winter Treks" subtitle="Experience the magic of snow-covered trails." treks={winterTreks} />
        )}
        
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
