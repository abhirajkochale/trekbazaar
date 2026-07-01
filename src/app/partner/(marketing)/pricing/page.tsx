import React from 'react';

export const metadata = {
  title: 'Pricing & Partnership | TrekBazaar',
  description: 'Simple, transparent, and fair pricing. We grow when you grow.',
};

export default function PricingPage() {
  return (
    <div className="bg-white text-[#111827] min-h-screen font-sans selection:bg-[#0F3D2E] selection:text-white">
      
      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111827] mb-6 leading-tight">
            Simple, transparent, and fair.
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            We grow when you grow. No setup fees, no monthly subscriptions, no hidden charges.
          </p>
        </div>
      </section>

      {/* Main Pricing Breakdown */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* The Fee */}
            <div>
              <div className="text-6xl font-bold text-[#111827] mb-4">
                12<span className="text-4xl text-[#6B7280]">%</span>
              </div>
              <div className="text-lg font-medium text-[#111827] mb-8">
                Commission on successful bookings
              </div>
              
              <ul className="space-y-3 text-[#6B7280]">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span> No setup fees</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span> No monthly subscription</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span> No hidden charges</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span> No lock-in period</li>
              </ul>
            </div>

            {/* What's Included */}
            <div className="bg-[#F6F7F9] p-8 rounded-2xl">
              <h3 className="font-bold text-[#111827] mb-6">What's included</h3>
              <ul className="space-y-5 text-[#111827]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0F3D2E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Payment gateway fees (2%)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0F3D2E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Customer acquisition & SEO</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0F3D2E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Secure payments & escrow</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0F3D2E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Dashboard & tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0F3D2E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>24/7 partner support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Example Settlement */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-bold text-[#111827] mb-8">Example Settlement</h3>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center text-[#6B7280]">
              <span>Customer Pays</span>
              <span className="font-medium text-[#111827]">₹10,000</span>
            </div>
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center text-[#6B7280]">
              <span>TrekBazaar (12%)</span>
              <span className="font-medium">- ₹1,200</span>
            </div>
            <div className="p-4 bg-[#F6F7F9] flex justify-between items-center font-bold text-[#111827]">
              <span>You Receive</span>
              <span>₹8,800</span>
            </div>
          </div>
          <p className="text-center text-sm text-[#6B7280] mt-6">
            Completely transparent. You always know what you earn.
          </p>
        </div>
      </section>
      
    </div>
  );
}
