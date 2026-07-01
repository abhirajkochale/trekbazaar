import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Check, X, Building2, Globe, Megaphone, 
  ShieldAlert, CreditCard, Banknote, HelpCircle 
} from 'lucide-react';

export const metadata = {
  title: 'Pricing & Partnership | TrekBazaar',
  description: 'Understand the transparent 12% commission model for TrekBazaar partners.',
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto px-4 py-20">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-[#1B5E3C] font-bold text-sm mb-6 border border-emerald-200">
          No Hidden Charges
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight">
          Simple, Transparent Partnership
        </h1>
        <p className="text-xl text-zinc-600 leading-relaxed font-medium">
          Opening a partner account is 100% free. You only pay when we deliver a successful booking.
        </p>
      </section>

      {/* Main Pricing Card */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Left: The Number */}
          <div className="p-12 md:w-2/5 border-b md:border-b-0 md:border-r border-zinc-700 flex flex-col justify-center items-center text-center bg-zinc-950">
            <div className="text-6xl font-black text-white mb-2">12<span className="text-[#D4AF37]">%</span></div>
            <div className="text-xl font-bold text-zinc-400 uppercase tracking-widest">Commission</div>
            <p className="mt-4 text-zinc-500 text-sm">
              Flat rate per successful booking.<br/>Includes all payment gateway fees.
            </p>
          </div>

          {/* Right: What's Included */}
          <div className="p-10 md:p-12 md:w-3/5 bg-[#0F3D2E]">
            <h3 className="text-2xl font-bold text-white mb-6">What&apos;s included in the commission?</h3>
            <ul className="space-y-4">
              {[
                "2% Payment Gateway processing fees",
                "SEO-optimized Company Microsite",
                "Placement on the TrekBazaar Search Engine",
                "Partner Operations Dashboard",
                "Automated Bank Settlements",
                "Customer Support & Dispute Resolution"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#D4AF37] shrink-0" />
                  <span className="text-zinc-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-zinc-900">The true cost of running it yourself</h2>
            <p className="text-zinc-600 mt-4 text-lg">See why paying commission is cheaper than building this infrastructure.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-zinc-100 border-b border-zinc-200 p-4 font-bold text-zinc-900">
              <div>Feature</div>
              <div className="text-center">Manual (WhatsApp/Forms)</div>
              <div className="text-center text-[#1B5E3C]">TrekBazaar</div>
            </div>
            
            {[
              { name: "Online Visibility", manual: false, tb: true },
              { name: "Payment Processing", manual: false, tb: true },
              { name: "Booking Management", manual: false, tb: true },
              { name: "Trust & Credibility", manual: false, tb: true },
              { name: "Automated Receipts", manual: false, tb: true },
              { name: "Customer Reviews", manual: false, tb: true },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 p-4 border-b border-zinc-100 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                <div className="font-medium text-zinc-700 flex items-center">{row.name}</div>
                <div className="flex justify-center items-center">
                  {row.manual ? <Check className="w-5 h-5 text-zinc-400" /> : <X className="w-5 h-5 text-red-400" />}
                </div>
                <div className="flex justify-center items-center">
                  {row.tb ? <Check className="w-5 h-5 text-[#1B5E3C]" /> : <X className="w-5 h-5 text-red-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-black text-zinc-900 mb-12 text-center">Important Partnership Policies</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200">
            <Banknote className="w-8 h-8 text-[#1B5E3C] mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Settlements</h3>
            <p className="text-zinc-600 leading-relaxed">
              To protect customers, funds are held in escrow until the trek concludes. Once the return date passes, 88% of the booking value (100% - 12% commission) is automatically settled to your verified bank account within 3 business days.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200">
            <ShieldAlert className="w-8 h-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Cancellations & Refunds</h3>
            <p className="text-zinc-600 leading-relaxed">
              If a customer cancels within your allowed policy window, we process the refund automatically. We do not charge the 12% commission on refunded amounts. If you cancel the trek, full refunds are mandatory.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center pb-10">
        <h2 className="text-3xl font-black text-zinc-900 mb-6">Ready to list your company?</h2>
        <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#c4a132] text-zinc-900 font-bold px-10 h-14 rounded-xl text-lg shadow-xl transition-all hover:-translate-y-1">
          Start Verification
        </Link>
      </section>
    </div>
  );
}
