import { getActiveTreks } from "@/lib/treks";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustMetrics } from "@/components/home/TrustMetrics";
import { FeaturedRegions } from "@/components/home/FeaturedRegions";
import { FeaturedTreks } from "@/components/home/FeaturedTreks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";

export default async function Home() {
  const treks = await getActiveTreks();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <TrustMetrics />
        <FeaturedRegions />
        <WhyChooseUs />
        <FeaturedTreks treks={treks} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
