import React from 'react';
import Link from 'next/link';
import { 
  Check, X, ShieldAlert, CreditCard, ArrowRight, Activity, Handshake, AlertTriangle
} from 'lucide-react';

export const metadata = {
  title: 'Pricing & Partnership | TrekBazaar',
  description: 'Understand the transparent 12% commission model. Zero fixed costs. Zero setup fees.',
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <section className="bg-zinc-50 pt-32 pb-24 border-b border-zinc-200">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-widest mb-8 border border-emerald-200 shadow-sm gap-2">
            <Handshake className="w-4 h-4" /> 100% Performance Based
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-8 tracking-tight leading-[1.1]">
            We make money only when <span className="text-[#1B5E3C]">you make money.</span>
          </h1>
          <p className="text-xl text-zinc-600 leading-relaxed font-medium max-w-2xl mx-auto">
            No setup fees. No monthly subscriptions. No hidden gateway charges. TrekBazaar takes a flat, transparent commission on successful bookings to fund your marketing and software.
          </p>
        </div>
      </section>

      {/* Main Pricing Card (Stripe-esque breakdown) */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10 mb-32">
        <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row border border-zinc-800">
          
          {/* Left: The Number */}
          <div className="p-12 md:p-16 md:w-5/12 bg-[#0F3D2E] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B5E3C] rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-4">Flat Platform Fee</div>
              <div className="flex items-baseline gap-1 mb-2">
                <div className="text-8xl font-black text-white tracking-tighter">12<span className="text-5xl text-[#D4AF37]">%</span></div>
              </div>
              <div className="text-xl font-medium text-emerald-400 mb-10">
                Per successful booking
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="text-sm text-zinc-400 font-bold mb-4 uppercase tracking-widest border-b border-white/10 pb-3">The Math</div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                       <div className="text-zinc-300">Customer Pays</div>
                       <div className="text-white font-bold">₹10,000</div>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                       <div className="text-zinc-300">TrekBazaar (12%)</div>
                       <div className="text-red-400 font-bold">- ₹1,200</div>
                     </div>
                     <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                       <div className="font-bold text-white text-lg">Your Settlement</div>
                       <div className="font-black text-[#D4AF37] text-xl">₹8,800</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: What's Included */}
          <div className="p-12 md:p-16 md:w-7/12 bg-zinc-900">
            <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Everything included. No add-ons.</h3>
            
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {[
                { title: "Payment Gateway", desc: "We absorb the 2% Razorpay transaction fees natively." },
                { title: "Customer Acquisition", desc: "Funded Google Ads and top SEO ranking for your routes." },
                { title: "Dashboard & Software", desc: "Unlimited access to manage bookings, inventory, and manifests." },
                { title: "Automated Escrow", desc: "Guaranteed NEFT/IMPS transfers direct to your bank." },
                { title: "SMS & Email Engine", desc: "Automated booking confirmations sent to your trekkers." },
                { title: "Trust & Safety", desc: "The verified badge that increases conversion by 40%." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1B5E3C]/20 flex items-center justify-center shrink-0 border border-[#1B5E3C]/50">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base mb-1">{item.title}</div>
                    <div className="text-sm text-zinc-400 leading-relaxed font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI / Build vs Buy Comparison */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Is 12% an expense or an investment?
            </h2>
            <p className="text-xl text-zinc-600 font-medium mt-6 max-w-3xl mx-auto">
              Operators who try to build this themselves end up spending significantly more capital upfront, while still failing to acquire customers organically. Look at the real costs:
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-xl shadow-zinc-200/50">
            <div className="grid grid-cols-12 bg-[#0F3D2E] p-6 font-black text-white text-sm uppercase tracking-wider">
              <div className="col-span-6 md:col-span-6 pl-4">Infrastructure Requirement</div>
              <div className="col-span-3 md:col-span-3 text-center text-zinc-300">Do It Yourself</div>
              <div className="col-span-3 md:col-span-3 text-center text-[#D4AF37]">TrekBazaar</div>
            </div>
            
            {[
              { name: "Payment Gateway Setup & Transaction Fees", diy: "~2.5% per booking", tb: "Included in 12%" },
              { name: "Website Hosting & Server Maintenance", diy: "₹15,000 / year", tb: "Included in 12%" },
              { name: "Google Ads & Social Media Marketing", diy: "₹40,000+ / month", tb: "Included in 12%" },
              { name: "Automated SMS/Email Communications", diy: "₹5,000 / year", tb: "Included in 12%" },
              { name: "Custom Booking Management Software", diy: "₹25,000+ setup", tb: "Included in 12%" },
              { name: "Independent Trust & Credibility Validation", diy: "Impossible to buy", tb: "Included in 12%" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-12 p-6 border-b border-zinc-100 bg-white hover:bg-zinc-50 transition-colors items-center">
                <div className="col-span-6 md:col-span-6 font-bold text-zinc-900 text-lg pl-4">{row.name}</div>
                <div className="col-span-3 md:col-span-3 flex justify-center items-center text-zinc-500 font-bold text-sm text-center bg-zinc-50 py-3 rounded-lg mx-2 border border-zinc-200">
                  {row.diy}
                </div>
                <div className="col-span-3 md:col-span-3 flex justify-center items-center font-black text-[#1B5E3C] text-sm text-center bg-emerald-50 py-3 rounded-lg mx-2 border border-emerald-100">
                  {row.tb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Policies (Cards) */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-bold text-xs uppercase tracking-widest mb-6 border border-red-200">
              <AlertTriangle className="w-4 h-4 mr-2" /> Edge Cases Explained
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">How we handle the hard parts</h2>
            <p className="text-xl text-zinc-600 font-medium mt-6 max-w-2xl mx-auto">
              We don&apos;t hide our refund policies in fine print. Here is exactly what happens when things don&apos;t go according to plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-zinc-50 p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center mb-8">
                 <CreditCard className="w-7 h-7 text-emerald-700" />
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">Escrow & Settlements</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                 When a customer books, funds are held in a nodal escrow account. Once the trek's return date is crossed successfully, the funds (minus 12%) are settled to you within 3 business days.
               </p>
               <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-100 leading-relaxed uppercase tracking-wide">
                 Why? This entirely prevents scam operators from taking customer money and disappearing, protecting the ecosystem.
               </div>
            </div>

            <div className="bg-zinc-50 p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mb-8">
                 <ShieldAlert className="w-7 h-7 text-amber-700" />
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">Customer Cancellations</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                 You define your own refund slab policy during onboarding (e.g., 50% refund if &lt; 10 days). If a trekker cancels within an eligible window, we auto-refund them.
               </p>
               <div className="text-sm font-bold text-zinc-900 bg-white p-4 rounded-xl border border-zinc-200 leading-relaxed shadow-sm">
                 <strong className="text-[#1B5E3C]">Crucially:</strong> We do not charge the 12% commission on any refunded amounts.
               </div>
            </div>

            <div className="bg-zinc-50 p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-red-100 border border-red-200 rounded-2xl flex items-center justify-center mb-8">
                 <Activity className="w-7 h-7 text-red-700" />
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">Operator Cancellations</h3>
               <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                 If you must cancel a batch due to extreme weather or force majeure, you issue a 100% refund to the trekkers via the dashboard.
               </p>
               <div className="text-sm font-bold text-zinc-900 bg-white p-4 rounded-xl border border-zinc-200 leading-relaxed shadow-sm">
                 <strong className="text-[#1B5E3C]">Crucially:</strong> We waive our platform fee entirely in this scenario. You pay nothing.
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0F3D2E]/20 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Stop building software.<br/><span className="text-[#D4AF37]">Start building experiences.</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 font-medium max-w-2xl mx-auto">
            Zero setup fees. Zero risk. Apply to become a verified partner today and transform your business.
          </p>
          <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-black px-12 h-16 rounded-xl text-xl shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1 active:scale-95">
            Begin Application <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
