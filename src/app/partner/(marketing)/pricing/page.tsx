import React from 'react';
import Link from 'next/link';
import { 
  Check, X, ShieldAlert, CreditCard, ArrowRight, Activity 
} from 'lucide-react';

export const metadata = {
  title: 'Pricing & Partnership | TrekBazaar',
  description: 'Understand the transparent 12% commission model for TrekBazaar partners.',
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <section className="bg-zinc-50 pt-32 pb-24 border-b border-zinc-200">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-widest mb-8 border border-emerald-200 shadow-sm">
            Zero Fixed Costs. Zero Setup Fees.
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-8 tracking-tight leading-[1.1]">
            We succeed only when <span className="text-[#1B5E3C]">you succeed.</span>
          </h1>
          <p className="text-xl text-zinc-600 leading-relaxed font-medium max-w-2xl mx-auto">
            TrekBazaar takes a flat commission on successful bookings. We reinvest that revenue into marketing your treks and maintaining world-class software.
          </p>
        </div>
      </section>

      {/* Main Pricing Card (Stripe-esque breakdown) */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10 mb-32">
        <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-800">
          
          {/* Left: The Number */}
          <div className="p-12 md:p-16 md:w-5/12 bg-[#0F3D2E] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B5E3C] rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-4">Flat Platform Fee</div>
              <div className="flex items-baseline gap-1 mb-2">
                <div className="text-7xl font-black text-white tracking-tighter">12<span className="text-4xl text-[#D4AF37]">%</span></div>
              </div>
              <div className="text-xl font-medium text-zinc-300 mb-8">
                Per successful booking
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-sm text-zinc-400 font-medium mb-1">Example: ₹10,000 Booking</div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-white">Your Payout</div>
                    <div className="font-black text-emerald-400">₹8,800</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: What's Included */}
          <div className="p-12 md:p-16 md:w-7/12 bg-zinc-900">
            <h3 className="text-2xl font-bold text-white mb-8">Everything included. No add-ons.</h3>
            
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { title: "Payment Gateway", desc: "Covers 2% Razorpay processing fees natively." },
                { title: "Marketing & SEO", desc: "Google Ads and top ranking for your routes." },
                { title: "Partner Dashboard", desc: "Manage bookings, inventory, and manifests." },
                { title: "Automated Payouts", desc: "NEFT/IMPS transfers direct to your bank." },
                { title: "SMS & Email Ops", desc: "Automated comms sent to your trekkers." },
                { title: "Dispute Support", desc: "We handle chargebacks and basic support." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#1B5E3C]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Policies (Cards) */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">How we handle the edge cases</h2>
            <p className="text-lg text-zinc-600 font-medium mt-4">Transparent policies protecting your business and the customer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
               <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                 <CreditCard className="w-6 h-6 text-emerald-600" />
               </div>
               <h3 className="text-xl font-bold text-zinc-900 mb-3">Escrow & Settlements</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-4">
                 When a customer books, funds are held in a nodal escrow account. Once the trek's return date is crossed successfully, the funds (minus 12%) are settled to you within 3 business days.
               </p>
               <div className="text-sm font-bold text-zinc-900 bg-zinc-50 p-3 rounded-lg">Why? Prevents scam operators from taking money and disappearing.</div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
               <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                 <ShieldAlert className="w-6 h-6 text-amber-600" />
               </div>
               <h3 className="text-xl font-bold text-zinc-900 mb-3">Customer Cancellations</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-4">
                 You define your own refund slab policy during onboarding (e.g., 50% refund if &lt; 10 days). If a trekker cancels within an eligible window, we auto-refund them. <strong className="text-zinc-900">We do not charge the 12% commission on refunded amounts.</strong>
               </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
               <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                 <Activity className="w-6 h-6 text-red-600" />
               </div>
               <h3 className="text-xl font-bold text-zinc-900 mb-3">Operator Cancellations</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-4">
                 If you cancel a batch due to extreme weather or force majeure, you must issue a 100% refund to the trekkers via the dashboard. We waive our platform fee entirely in this scenario.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI / Build vs Buy Comparison */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Is 12% worth it?
            </h2>
            <p className="text-xl text-zinc-600 font-medium mt-6">
              Compare the true costs of building your own infrastructure vs partnering with TrekBazaar.
            </p>
          </div>

          <div className="bg-zinc-50 rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-zinc-100 border-b border-zinc-200 p-6 font-bold text-zinc-900 text-sm uppercase tracking-wider">
              <div className="col-span-6 md:col-span-6">Infrastructure</div>
              <div className="col-span-3 md:col-span-3 text-center text-zinc-500">Do It Yourself</div>
              <div className="col-span-3 md:col-span-3 text-center text-[#1B5E3C]">TrekBazaar</div>
            </div>
            
            {[
              { name: "Payment Gateway Setup & Fees", diy: "~2.5% + Setup", tb: "Included" },
              { name: "Website Hosting & Maintenance", diy: "₹15,000/yr", tb: "Included" },
              { name: "Google Ads & SEO Marketing", diy: "₹40,000+/mo", tb: "Included" },
              { name: "Automated SMS/Email Comms", diy: "₹5,000/yr", tb: "Included" },
              { name: "Booking Management Software", diy: "₹2,000/mo", tb: "Included" },
              { name: "Trust & Credibility Badge", diy: "Impossible", tb: "Included" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-12 p-6 border-b border-zinc-100 bg-white hover:bg-zinc-50 transition-colors">
                <div className="col-span-6 md:col-span-6 font-bold text-zinc-800 flex items-center">{row.name}</div>
                <div className="col-span-3 md:col-span-3 flex justify-center items-center text-zinc-500 font-medium text-sm text-center">
                  {row.diy}
                </div>
                <div className="col-span-3 md:col-span-3 flex justify-center items-center font-black text-[#1B5E3C] text-sm text-center">
                  {row.tb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 py-24 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Stop building software.<br/>Start building experiences.</h2>
        <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-black px-12 h-16 rounded-xl text-lg shadow-[0_0_30px_-10px_rgba(212,175,55,0.4)] transition-all hover:scale-105">
          Apply as a Partner <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
