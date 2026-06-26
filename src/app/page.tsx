import { getActiveTreks } from "@/lib/treks";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedRegions } from "@/components/home/FeaturedRegions";
import { FeaturedTreks } from "@/components/home/FeaturedTreks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CTASection } from "@/components/home/CTASection";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export default async function Home() {
  const treks = await getActiveTreks();

  // Distinct regions derived from the real data
  const regions = Array.from(new Set(treks.map((t) => t.region))).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <FeaturedRegions />
        <FeaturedTreks treks={treks} regions={regions} />
        <WhyChooseUs />
        <CTASection />
        
        {/* General Enquiry Form retained from old homepage */}
        <Section id="contact" spacing="lg" background="surface" withBorder>
          <Container variant="reading">
            <div className="mb-8 text-center">
              <h2 className="text-h2 text-tb-text-primary mb-2">Still Unsure?</h2>
              <p className="text-body text-tb-text-secondary">
                Drop a general enquiry and our team will help you find the perfect trek.
              </p>
            </div>
            <div className="bg-white border border-tb-border rounded-tb-md p-6 shadow-tb-subtle">
              <EnquiryForm />
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
