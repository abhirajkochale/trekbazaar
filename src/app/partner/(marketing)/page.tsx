import React from 'react';
import { getCompanyContext } from '@/lib/company/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, Mountain, ShieldCheck, Banknote, 
  Search, Users, CheckCircle2, Star, ChevronRight, Activity, XCircle
} from 'lucide-react';

export const metadata = {
  title: 'Partner with TrekBazaar | Scale Your Trekking Business',
  description: 'Join India\'s premier verified marketplace for trekking operators. Professionalize your operations, automate settlements, and acquire high-intent trekkers.',
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
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0F3D2E] pt-32 pb-20 lg:pt-40 lg:pb-32 selection:bg-[#D4AF37] selection:text-zinc-900">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-br from-[#1B5E3C]/40 to-transparent rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-full blur-3xl opacity-30 mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-8 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
                </span>
                Accepting new operator applications for the winter season
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                Scale beyond WhatsApp. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#e8c65a]">Build a business trekkers trust.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed font-medium">
                You run incredible treks, but your operations are stuck in spreadsheets, manual UPI links, and endless chat threads. TrekBazaar provides the complete infrastructure to professionalize your storefront, automate settlements, and acquire high-intent customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-bold px-8 h-14 rounded-xl text-lg shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] transition-all active:scale-95 group">
                  Start Verification Application <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/partner/how-it-works" className="inline-flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-xl text-lg backdrop-blur-md transition-all active:scale-95">
                  Understand the process
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-zinc-400 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero setup fees</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Keep 100% data ownership</span>
              </div>
            </div>

            <div className="hidden lg:block relative perspective-1000">
              <div className="relative transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0 shadow-2xl rounded-2xl bg-white border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0F3D2E] flex items-center justify-center text-[#D4AF37] font-black text-xs border border-[#1B5E3C]">T</div>
                    <span className="font-bold text-zinc-900 tracking-tight">Partner Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-zinc-500 font-medium mb-1 text-sm tracking-wide uppercase">Next Settlement (Oct 12)</div>
                      <div className="text-4xl font-black text-zinc-900 tracking-tight">₹4,82,500</div>
                    </div>
                    <div className="flex items-center gap-1 text-[#1B5E3C] bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      <TrendingUpIcon className="w-4 h-4" /> Ready for transfer
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Departures</div>
                      <div className="text-xs font-bold text-[#1B5E3C]">View All</div>
                    </div>
                    {[
                      { name: 'Kedarkantha Winter Batch', date: 'Oct 15 - Oct 20', pax: '14/15 Booked', rev: '₹1,23,200', status: 'Filling Fast' },
                      { name: 'Brahmatal Expedition', date: 'Oct 18 - Oct 23', pax: '8/12 Booked', rev: '₹70,400', status: 'Confirmed' }
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                            <Mountain className="w-5 h-5 text-[#1B5E3C]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-900">{t.name}</div>
                            <div className="text-xs text-zinc-500 font-medium">{t.date} &middot; {t.pax}</div>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-zinc-900 text-sm">{t.rev}</div>
                           <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM / WHY WE BUILT THIS */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-8">
            Running a trekking company shouldn&apos;t mean drowning in admin work.
          </h2>
          <p className="text-xl text-zinc-600 leading-relaxed font-medium mb-16">
            We spoke to 300+ operators across India. The story is always the same. You spend 80% of your time chasing partial payments, manually sending itineraries on WhatsApp, and fighting for visibility against scam operators who slash prices. TrekBazaar was built to eliminate this chaos.
          </p>
        </div>
      </section>

      {/* THE SOLUTION / OUTCOMES */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Banknote className="w-7 h-7 text-[#1B5E3C]" />
              </div>
              <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">Stop chasing trekkers for the remaining 50% balance.</h3>
              <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-6">
                Most operators accept a 30% advance via UPI and pray the customer pays the rest at basecamp. This creates severe cashflow anxiety.
              </p>
              <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-8">
                TrekBazaar acts as a trusted escrow. Customers pay 100% upfront through our secure Razorpay gateway because they trust our brand. When the trek finishes, we automatically settle the funds directly to your verified business bank account.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-bold text-zinc-900"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Guaranteed 100% upfront collection</li>
                <li className="flex items-center gap-3 font-bold text-zinc-900"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> NEFT/IMPS automated settlements</li>
              </ul>
            </div>
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 shadow-xl shadow-zinc-200/50 relative">
               <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm font-bold text-xs text-zinc-900 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Auto-Settled
               </div>
               <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" alt="Accounting" className="rounded-2xl border border-zinc-200 shadow-sm opacity-90 mix-blend-multiply" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
            <div className="order-2 md:order-1 bg-[#0F3D2E] rounded-3xl p-8 border border-[#1B5E3C] shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
               <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                 <div className="text-white font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-[#D4AF37]" /> Live Manifest Download</div>
                 <div className="space-y-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center">
                       <div>
                         <div className="text-white font-medium text-sm">Customer #{840 + i}</div>
                         <div className="text-zinc-400 text-xs">Medical: Cleared</div>
                       </div>
                       <div className="text-[#D4AF37] text-xs font-bold uppercase">Paid</div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">Every booking detail organized in one place.</h3>
              <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-6">
                Forget scrolling through WhatsApp to find emergency contacts or medical conditions. TrekBazaar captures all critical data during checkout.
              </p>
              <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-8">
                Download a clean, structured manifest for your Trek Leaders the day before the departure. Track capacity limits in real-time to avoid double booking. 
              </p>
              <Link href="/partner/register" className="font-bold text-[#1B5E3C] hover:text-[#0F3D2E] flex items-center gap-1 group">
                Create your partner account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* WHO SHOULD NOT JOIN (Extreme Trust Filter) */}
      <section className="py-24 bg-zinc-900 text-white border-y border-zinc-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Who should <span className="text-red-500">NOT</span> join TrekBazaar?</h2>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
              We aggressively defend the trust our customers place in us. We are not an open bulletin board. We reject 35% of all applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><XCircle className="w-6 h-6 text-red-500" /> Do not apply if:</h3>
              <ul className="space-y-4 text-zinc-300 font-medium leading-relaxed">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div> You operate without a registered company or valid GST.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div> You outsource operations entirely to third parties on the ground.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div> You cut corners on safety equipment to offer the &quot;lowest price&quot; in the market.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div> You cannot guarantee refunds for weather-induced cancellations.</li>
              </ul>
            </div>
            
            <div className="bg-[#1B5E3C]/20 border border-[#1B5E3C]/50 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /> Please apply if:</h3>
              <ul className="space-y-4 text-emerald-100 font-medium leading-relaxed">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></div> You are a registered entity serious about scaling your operations.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></div> You employ certified trek leaders and prioritize customer safety above margins.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></div> You want to stop competing on price and start competing on quality.</li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></div> You are willing to undergo strict verification to earn the TrekBazaar Badge.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER ACQUISITION ENGINE */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">How do you get bookings?</h2>
            <p className="text-xl text-zinc-600 font-medium max-w-3xl mx-auto leading-relaxed">
              When you list a departure on TrekBazaar, you are immediately plugging into our massive customer acquisition engine. We spend the marketing money so you don&apos;t have to.
            </p>
         </div>
         <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">SEO Dominance</h4>
              <p className="text-zinc-600 font-medium">Our Master Trek pages rank at the top of Google. Your departures are automatically listed on these high-traffic pages.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-100">
                <Activity className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">Performance Marketing</h4>
              <p className="text-zinc-600 font-medium">We run highly targeted Google and Meta ads for specific seasons. The 12% commission funds this machine entirely.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">The Trust Conversion</h4>
              <p className="text-zinc-600 font-medium">Customers who find you organically convert at a 40% higher rate when they book through the TrekBazaar secure checkout.</p>
            </div>
         </div>
      </section>

      {/* FULL FAQ */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6">
              Everything you need to know.
            </h2>
            <p className="text-xl text-zinc-600 font-medium">No hidden terms. Total transparency.</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Why should I pay 12% instead of taking free WhatsApp bookings?",
                a: "Because WhatsApp isn't free. You pay in lost hours, manual follow-ups, payment gateway setup fees, lost trust from skeptical buyers, and zero marketing reach. Our 12% covers your Razorpay fees, your hosting, your SEO, and guarantees your customer pays 100% upfront."
              },
              {
                q: "Who owns the customer data?",
                a: "You do. You get full access to the customer's name, contact details, emergency info, and medical history. We never hide your customers from you."
              },
              {
                q: "Is there exclusivity? Do I have to sell only on TrekBazaar?",
                a: "Absolutely not. You have total control over your inventory. You simply allocate a certain number of slots to TrekBazaar via your dashboard. You can continue selling via your own channels simultaneously."
              },
              {
                q: "Can I leave TrekBazaar later?",
                a: "Yes. There are no lock-in contracts. You can unpublish your inventory and close your account at any time with a single click."
              },
              {
                q: "What if a trekker cancels? Who handles refunds?",
                a: "During onboarding, you define your own cancellation policy (e.g., 50% refund if cancelled 15 days prior). If a trekker cancels, the platform processes the refund automatically based on your rules. We do not charge commission on refunded amounts."
              },
              {
                q: "What if I don't get any bookings?",
                a: "Then you pay absolutely nothing. We charge zero setup fees and zero monthly subscription fees. We only make money when you successfully complete a booking."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-zinc-300 transition-colors">
                <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none p-6 text-zinc-900 group-hover:text-[#1B5E3C] transition-colors">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-zinc-600 font-medium leading-relaxed border-t border-zinc-100 pt-4 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* EXTREME CTA */}
      <section className="py-32 bg-[#0F3D2E] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent mix-blend-multiply"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4AF37] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-widest uppercase text-xs mb-8 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
            Application Time: ~15 Minutes
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]">
            Professionalize your entire operation today.
          </h2>
          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join the most trusted network of verified trekking operators in India. 
            Stop managing spreadsheets. Start scaling your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-black px-12 h-16 rounded-xl text-xl shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all active:scale-95">
              Begin Verification Application
            </Link>
            <Link href="/partner/pricing" className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black px-12 h-16 rounded-xl text-xl backdrop-blur-md transition-all active:scale-95">
              Review Pricing First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}
