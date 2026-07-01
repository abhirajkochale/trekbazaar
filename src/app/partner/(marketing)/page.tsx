import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Partner with TrekBazaar | Grow your trekking business',
  description: 'Join India\'s most trusted marketplace for trekking experiences. Get verified, get discovered, and grow your business.',
};

export default async function PartnerLandingPage() {
  const ctx = await getCompanyContext();

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
    <div className="bg-white text-[#111827] min-h-screen font-sans selection:bg-[#0F3D2E] selection:text-white">
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111827] mb-8 leading-[1.1]">
            Grow your trekking business with TrekBazaar.
          </h1>
          <p className="text-xl md:text-2xl text-[#6B7280] mb-12 max-w-3xl mx-auto leading-relaxed">
            Join India's most trusted marketplace for trekking experiences. Get verified, get discovered, and manage your bookings in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/partner/register" 
              className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#0a291f] text-white font-medium px-8 h-12 rounded-lg text-base transition-colors w-full sm:w-auto"
            >
              List Your Company
            </Link>
            <Link 
              href="/partner/how-it-works" 
              className="inline-flex items-center justify-center bg-white hover:bg-zinc-50 border border-zinc-200 text-[#111827] font-medium px-8 h-12 rounded-lg text-base transition-colors w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* STATS / TRUST BAR */}
      <section className="py-12 border-y border-zinc-100 bg-[#F6F7F9]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-200">
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-[#111827] mb-2">250+</div>
              <div className="text-sm font-medium text-[#6B7280]">Verified Operators</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-[#111827] mb-2">15K+</div>
              <div className="text-sm font-medium text-[#6B7280]">Trekking Experiences</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-[#111827] mb-2">120K+</div>
              <div className="text-sm font-medium text-[#6B7280]">Happy Trekkers</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-[#111827] mb-2">4.8★</div>
              <div className="text-sm font-medium text-[#6B7280]">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITION */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-20 tracking-tight">
            Everything you need to run and grow your business.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-16 text-left">
            <div>
              <div className="w-12 h-12 bg-[#F6F7F9] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#0F3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Get Discovered</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Reach thousands of serious trekkers actively searching for verified experiences on our platform. We handle the SEO and marketing.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-[#F6F7F9] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#0F3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Manage Easily</h3>
              <p className="text-[#6B7280] leading-relaxed">
                All your bookings, customer details, manifests, and payments in one clean, powerful dashboard. No more spreadsheets.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-[#F6F7F9] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#0F3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Get Paid On Time</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Secure escrow and automated settlements straight to your bank account after every successful trek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST */}
      <section className="py-32 bg-[#F6F7F9] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium text-[#111827] leading-relaxed mb-10">
            "TrekBazaar gave us the professional infrastructure we needed. We stopped worrying about collecting partial payments and started focusing entirely on the mountains."
          </p>
          <div className="text-sm font-medium text-[#6B7280] uppercase tracking-widest">
            — Trusted by verified trekking companies across India
          </div>
        </div>
      </section>
      
      {/* FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-8 tracking-tight">
            Ready to professionalize your business?
          </h2>
          <Link 
            href="/partner/register" 
            className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#0a291f] text-white font-medium px-8 h-12 rounded-lg text-base transition-colors"
          >
            List Your Company
          </Link>
        </div>
      </section>
    </div>
  );
}
