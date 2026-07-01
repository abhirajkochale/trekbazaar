import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, Mountain, ShieldCheck, Banknote, 
  Search, BarChart3, Users, CheckCircle2, Star, 
  HelpCircle, ChevronRight, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Partner with TrekBazaar | Grow Your Trekking Business',
  description: 'Join India\'s premium verified marketplace for trekking operators. Get a professional storefront, manage bookings, and reach thousands of trekkers.',
};

export default async function PartnerLandingPage() {
  const ctx = await getCompanyContext();

  // Redirect users who already have an account
  if (ctx.status === "ok") {
    if (ctx.company.onboarding_status === "APPROVED") {
      redirect("/partner/dashboard");
    } else {
      redirect("/partner/onboarding/status");
    }
  } else if (ctx.status === "multiple-companies") {
    redirect("/partner/onboarding");
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F3D2E] pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"
            alt="Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E] via-[#0F3D2E]/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37]"></span>
              Trusted by 120+ top operators in India
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              Scale your trekking business with confidence.
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl">
              Stop relying on scattered WhatsApp messages and Google Forms. TrekBazaar provides a premium storefront, verified bookings, and automated settlements—so you can focus on the mountains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-bold px-8 h-14 rounded-xl text-lg shadow-lg transition-all active:scale-95">
                Open Partner Account <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/partner/how-it-works" className="inline-flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-xl text-lg backdrop-blur-md transition-all active:scale-95">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest text-center md:text-left">
              Built for operators
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
              <div className="flex items-center gap-2 font-black text-xl text-zinc-800"><Mountain className="w-6 h-6"/> Alpine Ascents</div>
              <div className="flex items-center gap-2 font-black text-xl text-zinc-800"><Mountain className="w-6 h-6"/> Peak Pioneers</div>
              <div className="flex items-center gap-2 font-black text-xl text-zinc-800"><Mountain className="w-6 h-6"/> Valley Ventures</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F3D2E] tracking-tight mb-6">
              Everything you need to run a modern trekking operation.
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed">
              We built TrekBazaar specifically for the Indian trekking ecosystem. Our tools solve the exact operational headaches you face daily.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#1B5E3C]/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-[#1B5E3C]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Premium Discovery</h3>
              <p className="text-zinc-600 leading-relaxed">
                TrekBazaar ranks highly on Google for major trek destinations. By listing with us, your departures instantly get in front of thousands of high-intent trekkers.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#1B5E3C]/10 rounded-2xl flex items-center justify-center mb-6">
                <Banknote className="w-7 h-7 text-[#1B5E3C]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Automated Settlements</h3>
              <p className="text-zinc-600 leading-relaxed">
                No more chasing customers for UPI payments. We handle 100% of the payment processing, invoicing, and automatic bank settlements.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-[#1B5E3C]/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-[#1B5E3C]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Professional Dashboard</h3>
              <p className="text-zinc-600 leading-relaxed">
                Manage your inventory, track daily bookings, and download manifest lists for your trek leaders—all from a single, beautiful interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview / Trust */}
      <section className="py-32 bg-[#0F3D2E] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#1B5E3C] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-wide uppercase text-sm mb-4">
                <ShieldCheck className="w-4 h-4" /> Strict Quality Control
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Why does TrekBazaar require verification?
              </h2>
              <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                We are not an open bulletin board. We are a curated marketplace. Trekkers book through us because they know we only partner with professional, legitimate, and safe operators.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Builds massive trust with customers",
                  "Eliminates scam operators from your competition",
                  "Allows us to guarantee payment security",
                  "Ensures high-quality ecosystem"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-200">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/partner/how-it-works" className="inline-flex items-center font-bold text-[#D4AF37] hover:text-white transition-colors text-lg">
                View our verification process <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
            
            {/* Mock Dashboard UI */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-2 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="h-10 bg-white border-b border-zinc-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-zinc-900 font-bold text-xl">Revenue</div>
                      <div className="text-[#1B5E3C] bg-[#1B5E3C]/10 px-3 py-1 rounded-full text-sm font-bold">+24% this week</div>
                    </div>
                    <div className="text-4xl font-black text-zinc-900 mb-8">₹4,25,000</div>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                              <div className="text-zinc-900 font-bold">Hampta Pass • 12 Aug</div>
                              <div className="text-zinc-500 text-sm">4 Trekkers</div>
                            </div>
                          </div>
                          <div className="text-zinc-900 font-bold">+₹32,000</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-4">
              Don&apos;t just take our word for it
            </h2>
            <p className="text-zinc-600 text-lg">
              Hear from operators who transformed their business with TrekBazaar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 p-10 rounded-3xl border border-zinc-200">
              <div className="flex text-[#D4AF37] mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-xl text-zinc-800 font-medium mb-8 leading-relaxed">
                &quot;Before TrekBazaar, we spent 4 hours a day just answering WhatsApp messages about availability. Now, the bookings just show up on our dashboard and the money hits our bank account. It&apos;s completely changed how we operate.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Profile" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">Rajesh Sharma</div>
                  <div className="text-zinc-500 text-sm">Founder, Himalayan Ventures</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 p-10 rounded-3xl border border-zinc-200">
              <div className="flex text-[#D4AF37] mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-xl text-zinc-800 font-medium mb-8 leading-relaxed">
                &quot;The verification process was strict, but it proved to me that this is a serious platform. Our bookings have increased by 40% in just one season because customers trust the TrekBazaar brand.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" alt="Profile" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">Priya Patel</div>
                  <div className="text-zinc-500 text-sm">Operations Head, Peak Expeditions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Model / Pricing CTA */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-6">
            Transparent Pricing. No Hidden Fees.
          </h2>
          <p className="text-xl text-zinc-600 mb-10 leading-relaxed">
            Opening a partner account is 100% free. We only make money when you make money. Our simple commission structure covers payment gateways, marketing, and platform costs.
          </p>
          <Link href="/partner/pricing" className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#1B5E3C] text-white font-bold px-8 h-14 rounded-xl text-lg transition-all">
            View Pricing & Commission Details
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "How long does verification take?",
                a: "Once you submit all required documents in the onboarding wizard, our team manually reviews your application within 24-48 hours. If everything is in order, your account will be activated immediately."
              },
              {
                q: "Do I need to be a registered company?",
                a: "Yes. To ensure safety and accountability, we require a valid GST number and registered company documents. Freelance guides without a registered entity cannot list directly at this time."
              },
              {
                q: "When do I receive payments for bookings?",
                a: "Payments are settled directly to your verified bank account within 3 business days after the trek successfully concludes. This protects both you and the customer."
              },
              {
                q: "Can I manage my own cancellation policies?",
                a: "Yes. During onboarding, you will agree to standard commercial terms, but you have flexibility in defining specific cut-off dates for your departures."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#1B5E3C] shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-zinc-600 pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#0F3D2E] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Ready to digitize your trekking business?
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Join the fastest growing network of verified trekking operators in India. The application takes about 15 minutes to complete.
          </p>
          <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-bold px-10 h-16 rounded-xl text-xl shadow-xl hover:-translate-y-1 transition-transform">
            Start Your Application
          </Link>
          <p className="mt-6 text-sm text-zinc-400">
            No credit card required. Free to register.
          </p>
        </div>
      </section>
    </div>
  );
}
