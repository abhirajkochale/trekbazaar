import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  UserPlus, FileCheck, Mountain, Search, 
  CreditCard, TrendingUp, CheckCircle2, ChevronRight
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | TrekBazaar Partners',
  description: 'Understand the journey from registration to getting your first booking on TrekBazaar.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="w-6 h-6 text-[#D4AF37]" />,
      title: "Register Your Business",
      time: "15 Minutes",
      operatorAction: "Create an account and complete the 4-step onboarding wizard providing company info, banking details, and accepting terms.",
      tbAction: "We securely store your data and prepare a profile for our verification team."
    },
    {
      id: 2,
      icon: <FileCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "Company Verification",
      time: "24-48 Hours",
      operatorAction: "Wait for our team to review your documents. If we need more info, we'll email you.",
      tbAction: "Our trust & safety team manually verifies your GST, company registration, and banking details to ensure safety for trekkers."
    },
    {
      id: 3,
      icon: <Mountain className="w-6 h-6 text-[#D4AF37]" />,
      title: "Publish Your First Trek",
      time: "10 Minutes per trek",
      operatorAction: "Access your new dashboard, select a Master Destination, and set your own prices, dates, and inventory.",
      tbAction: "We instantly generate a beautiful, SEO-optimized microsite for your trek using our high-quality Master Trek data."
    },
    {
      id: 4,
      icon: <Search className="w-6 h-6 text-[#D4AF37]" />,
      title: "Trekkers Discover You",
      time: "Ongoing",
      operatorAction: "Keep your inventory up to date and provide great service to earn positive reviews.",
      tbAction: "Our marketing engine drives high-intent traffic to our comparison pages, putting your departures in front of thousands of buyers."
    },
    {
      id: 5,
      icon: <CreditCard className="w-6 h-6 text-[#D4AF37]" />,
      title: "Receive Bookings & Payments",
      time: "Instant Booking",
      operatorAction: "Download trekker manifests directly from your dashboard and prepare for the departure.",
      tbAction: "We process the customer's payment securely via our gateway and instantly notify you via email and dashboard."
    },
    {
      id: 6,
      icon: <TrendingUp className="w-6 h-6 text-[#D4AF37]" />,
      title: "Settlements & Growth",
      time: "Trek Completion + 3 Days",
      operatorAction: "Deliver an amazing trekking experience.",
      tbAction: "We automatically route the settled funds directly into your registered bank account and prompt the customer for a review."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      
      {/* Header */}
      <section className="bg-[#0F3D2E] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            How TrekBazaar Works
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed font-medium">
            From registration to your first booking&mdash;understand exactly what happens behind the scenes when you join India&apos;s premium trekking marketplace.
          </p>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="relative border-l-2 border-zinc-200 ml-4 md:ml-8 space-y-16 py-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative pl-8 md:pl-16">
                
                {/* Timeline Dot */}
                <div className="absolute -left-6 md:-left-8 top-1 w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-zinc-200 rounded-full flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                      {step.id}. {step.title}
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 self-start md:self-auto">
                      Time: {step.time}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
                      <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">What you do</div>
                      <p className="text-zinc-700 leading-relaxed font-medium">
                        {step.operatorAction}
                      </p>
                    </div>
                    <div className="bg-[#0F3D2E]/5 p-5 rounded-xl border border-[#0F3D2E]/10">
                      <div className="text-sm font-bold text-[#1B5E3C] uppercase tracking-wider mb-2">What TrekBazaar does</div>
                      <p className="text-zinc-800 leading-relaxed font-medium">
                        {step.tbAction}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Connecting Arrow for mobile readability */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -bottom-10 left-0 text-zinc-300">
                    <ChevronRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-zinc-50 rounded-3xl p-10 text-center border border-zinc-200">
          <CheckCircle2 className="w-12 h-12 text-[#1B5E3C] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-zinc-900 mb-4">
            Clear enough?
          </h2>
          <p className="text-lg text-zinc-600 mb-8 max-w-xl mx-auto">
            We built this platform to take the operational heavy-lifting off your plate so you can focus on delivering great treks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#1B5E3C] text-white font-bold h-14 px-8 rounded-xl transition-all">
              Start Registration
            </Link>
            <Link href="/partner/pricing" className="inline-flex items-center justify-center border border-zinc-300 h-14 px-8 rounded-xl font-bold hover:bg-zinc-100 transition-all">
              View Pricing Model
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
