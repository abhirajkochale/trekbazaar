import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, Mountain, ShieldCheck, Banknote, 
  Search, BarChart3, Users, CheckCircle2, Star, 
  HelpCircle, ChevronRight, Activity
} from 'lucide-react';

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
      {/* Hero Section - SaaS Style */}
      <section className="relative overflow-hidden bg-[#0F3D2E] pt-32 pb-20 lg:pt-40 lg:pb-32 selection:bg-[#D4AF37] selection:text-zinc-900">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-br from-[#1B5E3C]/40 to-transparent rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-3xl opacity-30 mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-8 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
                </span>
                Now onboarding verified operators for the Winter Season
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                The operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#e8c65a]">trekking companies.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed font-medium">
                Ditch the WhatsApp groups, Excel sheets, and manual UPI links. TrekBazaar provides a world-class storefront, instant verified bookings, and automated bank settlements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-bold px-8 h-14 rounded-xl text-lg shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] transition-all active:scale-95 group">
                  Open Partner Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/partner/how-it-works" className="inline-flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-xl text-lg backdrop-blur-md transition-all active:scale-95">
                  See the workflow
                </Link>
              </div>
              <p className="mt-6 text-sm text-zinc-400 font-medium">
                No setup fees. No monthly subscriptions. 100% performance based.
              </p>
            </div>

            {/* Right UI Mockup (Premium B2B Feel) */}
            <div className="hidden lg:block relative perspective-1000">
              <div className="relative transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0 shadow-2xl rounded-2xl bg-white border border-zinc-200 overflow-hidden">
                {/* Mock Header */}
                <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0F3D2E] flex items-center justify-center text-white font-black text-xs">T</div>
                    <span className="font-bold text-zinc-900">Partner Hub</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                  </div>
                </div>
                {/* Mock Body */}
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-zinc-500 font-medium mb-1 text-sm">Monthly Revenue</div>
                      <div className="text-4xl font-black text-zinc-900">₹8,45,000</div>
                    </div>
                    <div className="flex items-center gap-1 text-[#1B5E3C] bg-emerald-50 px-2 py-1 rounded-md text-sm font-bold">
                      <TrendingUpIcon className="w-4 h-4" /> +18.2%
                    </div>
                  </div>
                  {/* Chart Mock */}
                  <div className="h-32 flex items-end gap-2 mb-8">
                    {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#1B5E3C]/10 rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="w-full bg-[#1B5E3C] rounded-t-sm transition-all duration-1000" style={{ height: `${h * 0.8}%` }}></div>
                      </div>
                    ))}
                  </div>
                  {/* Recent Bookings */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Live Departures</div>
                    {[
                      { name: 'Kedarkantha Trek', pax: 12, rev: '₹1,44,000' },
                      { name: 'Brahmatal Winter', pax: 8, rev: '₹92,000' }
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-zinc-100 bg-zinc-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
                            <Mountain className="w-4 h-4 text-[#1B5E3C]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-900">{t.name}</div>
                            <div className="text-xs text-zinc-500">{t.pax} Trekkers confirmed</div>
                          </div>
                        </div>
                        <div className="font-bold text-zinc-900 text-sm">{t.rev}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Scale Bar */}
      <section className="border-b border-zinc-100 bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-200">
            <div className="text-center px-4">
              <div className="text-3xl font-black text-zinc-900 mb-1">₹4.2Cr+</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Processed Annually</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-zinc-900 mb-1">0%</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Chargeback Rate</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-zinc-900 mb-1">3 Days</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Avg. Settlement Time</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-zinc-900 mb-1">120+</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Verified Operators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiated Benefits (Bento Box Layout) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-20">
            <h2 className="text-sm font-bold text-[#1B5E3C] tracking-widest uppercase mb-3">The Platform Advantage</h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-6">
              Infrastructure built for scale, not just a listing directory.
            </h3>
            <p className="text-xl text-zinc-600 leading-relaxed font-medium">
              We solve the hard problems—marketing, payments, customer trust, and operational syncing—so you can spend your time ensuring safety and experience on the mountain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Large Card 1 */}
            <div className="md:col-span-2 bg-zinc-50 rounded-3xl p-10 border border-zinc-200 relative overflow-hidden group hover:border-zinc-300 transition-colors">
              <div className="relative z-10 max-w-sm">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
                  <Banknote className="w-6 h-6 text-[#1B5E3C]" />
                </div>
                <h4 className="text-2xl font-black text-zinc-900 mb-3">Guaranteed, Automated Settlements</h4>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  No more chasing trekkers for the remaining 50% balance via UPI. We collect 100% upfront. Once the trek concludes safely, funds are automatically routed to your registered bank account. Zero stress.
                </p>
              </div>
              {/* UI Decorator */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-80 bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-10 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4 border-b border-zinc-100 pb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
                  <div>
                    <div className="font-bold text-sm">Settlement Initiated</div>
                    <div className="text-xs text-zinc-500">HDFC Bank ****4592</div>
                  </div>
                  <div className="ml-auto font-black text-sm">₹84,500</div>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-[#0F3D2E] rounded-3xl p-10 relative overflow-hidden text-white group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                  <Search className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h4 className="text-2xl font-black mb-3 text-[#D4AF37]">Instant Distribution</h4>
                <p className="text-zinc-300 font-medium leading-relaxed">
                  Publish a departure on your dashboard and it instantly ranks on our heavily SEO-optimized marketplace. Tap into our audience of high-intent buyers.
                </p>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-zinc-50 rounded-3xl p-10 border border-zinc-200 group hover:border-zinc-300 transition-colors">
               <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#1B5E3C]" />
                </div>
                <h4 className="text-xl font-black text-zinc-900 mb-3">Manifest Management</h4>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  Download live trekker manifests with medical history, emergency contacts, and ID proofs. Keep your trek leaders fully informed.
                </p>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-2 bg-zinc-50 rounded-3xl p-10 border border-zinc-200 relative overflow-hidden group hover:border-zinc-300 transition-colors">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#1B5E3C]" />
                </div>
                <h4 className="text-2xl font-black text-zinc-900 mb-3">The &quot;Verified&quot; Halo Effect</h4>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  Trekkers are terrified of scam operators. By passing our stringent due-diligence process, you earn the TrekBazaar Verified Badge. Operators see an average <span className="font-bold text-zinc-900">40% increase in conversion rates</span> compared to booking via their own websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The "Why Verification" Section (Deep Dive into Trust) */}
      <section className="py-32 bg-[#0F3D2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-widest uppercase text-xs mb-6 bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
                <ShieldCheck className="w-4 h-4" /> Strict Quality Control
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                Why is it so hard to get approved on TrekBazaar?
              </h2>
              <p className="text-zinc-300 text-lg mb-8 leading-relaxed font-medium">
                We are not an open bulletin board. We reject approximately 35% of all operator applications. We do this to protect the ecosystem. When customers see your company listed on TrekBazaar, they implicitly trust you with their lives and their money.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="w-10 h-10 bg-[#1B5E3C] rounded-lg flex items-center justify-center mb-4">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-bold text-lg mb-2">Safety First</h5>
                  <p className="text-zinc-400 text-sm leading-relaxed">We verify equipment standards and trek leader certifications.</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-[#1B5E3C] rounded-lg flex items-center justify-center mb-4">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-bold text-lg mb-2">Financial Solvency</h5>
                  <p className="text-zinc-400 text-sm leading-relaxed">We verify GST, bank accounts, and company registration.</p>
                </div>
              </div>
              
              <Link href="/partner/how-it-works" className="inline-flex items-center font-bold text-[#D4AF37] hover:text-white transition-colors text-lg group">
                Review the onboarding workflow <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* The Badge Graphic */}
            <div className="flex justify-center lg:justify-end">
               <div className="relative w-72 h-72">
                  <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-[100px] opacity-20"></div>
                  <div className="relative w-full h-full border-[12px] border-[#1B5E3C] rounded-full flex flex-col items-center justify-center bg-zinc-900 shadow-2xl">
                     <ShieldCheck className="w-24 h-24 text-[#D4AF37] mb-2" />
                     <div className="text-[#D4AF37] font-black text-xl uppercase tracking-widest">Verified</div>
                     <div className="text-white font-bold tracking-widest text-sm">Operator</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Social Proof */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">
              Trusted by the best in the mountains.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex text-[#D4AF37] mb-8 gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-2xl text-zinc-800 font-bold mb-10 leading-snug">
                &quot;Before TrekBazaar, my ops team spent 4 hours every day just answering WhatsApp messages about availability. Now, the bookings just show up on our dashboard and the money hits our bank account. It&apos;s completely changed how we operate.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-200 rounded-full overflow-hidden border-2 border-zinc-100">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-black text-zinc-900 text-lg">Rajesh Sharma</div>
                  <div className="text-zinc-500 font-medium">Founder, Himalayan Ventures</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex text-[#D4AF37] mb-8 gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-2xl text-zinc-800 font-bold mb-10 leading-snug">
                &quot;The onboarding was strict, but it proved to me that this is a serious platform. Our bookings have increased by 45% in one season simply because customers trust the TrekBazaar checkout process more than a random UPI link.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-200 rounded-full overflow-hidden border-2 border-zinc-100">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-black text-zinc-900 text-lg">Priya Patel</div>
                  <div className="text-zinc-500 font-medium">Operations Head, Peak Expeditions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "What does the 12% commission cover?",
                a: "Everything. It includes the 2% payment gateway fee, server costs, marketing acquisition costs, SMS/Email notifications to your customers, and automated payouts. There are absolutely no setup fees, monthly fees, or hidden charges."
              },
              {
                q: "How long does verification take?",
                a: "Once you submit your GST, bank details, and company documents in our onboarding wizard, our Trust & Safety team manually reviews your application within 24-48 hours."
              },
              {
                q: "Do I need to give TrekBazaar exclusive inventory?",
                a: "No. You have full control over your inventory. You simply allocate a certain number of slots to TrekBazaar via your dashboard. You can continue selling via your own channels simultaneously."
              },
              {
                q: "When do I receive payments?",
                a: "To protect trekkers, funds are held in escrow. Once the trek successfully concludes (based on the return date), funds are automatically settled to your verified bank account within 3 business days."
              },
              {
                q: "What if a trekker cancels?",
                a: "You define your cancellation policy during onboarding (e.g., 50% refund if cancelled 15 days prior). If a trekker cancels, the platform handles the refund automatically. We do not charge commission on refunded amounts."
              },
              {
                q: "What if bad weather forces us to cancel a trek?",
                a: "If the operator (you) cancels the trek due to force majeure or operational issues, a 100% refund must be issued to the trekkers. You can trigger this directly from your dashboard."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden open:bg-white open:border-zinc-300 transition-colors">
                <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none p-6 text-zinc-900 group-hover:text-[#1B5E3C] transition-colors">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-zinc-600 font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final Massive CTA */}
      <section className="py-32 bg-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0F3D2E]/20 mix-blend-multiply"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#1B5E3C] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
            Stop losing bookings to<br/>unprofessional checkout flows.
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
            Join the fastest growing network of verified trekking operators in India. 
            The application takes about 15 minutes.
          </p>
          <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-black px-12 h-16 rounded-xl text-xl shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)] hover:scale-105 transition-all">
            Start Verification Application
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-bold text-zinc-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to apply</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dummy Icons for UI Mockup
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}
