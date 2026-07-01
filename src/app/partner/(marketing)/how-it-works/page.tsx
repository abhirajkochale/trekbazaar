import React from 'react';
import Link from 'next/link';
import { 
  UserPlus, FileCheck, Mountain, Search, 
  CreditCard, TrendingUp, CheckCircle2, ChevronDown, ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | TrekBazaar Partners',
  description: 'Understand the exact journey from registration to getting your first payout on TrekBazaar.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: "Submit Application",
      time: "15 Minutes",
      outcome: "Application ready for Trust & Safety review.",
      operatorAction: "Complete the 4-step onboarding wizard. You will need to upload your GST certificate, company PAN, and banking details. You will also digitally sign the commercial terms.",
      tbAction: "Our system securely encrypts your documents and prepares a unified profile for our manual verification queue."
    },
    {
      id: 2,
      icon: <FileCheck className="w-6 h-6 text-white" />,
      title: "Manual Verification",
      time: "24-48 Hours",
      outcome: "Account Activated & Dashboard Unlocked.",
      operatorAction: "Wait for approval. If our team finds discrepancies in your documents, we will email you to request clarifications.",
      tbAction: "Our Trust & Safety team verifies your business entity against government databases and ensures your bank accounts match the registered company name."
    },
    {
      id: 3,
      icon: <Mountain className="w-6 h-6 text-white" />,
      title: "Publish Inventory",
      time: "5 Minutes per departure",
      outcome: "Departures go live on TrekBazaar.com",
      operatorAction: "Log into your new dashboard. Select from our 200+ Master Treks (e.g., Roopkund, Hampta Pass), set your dates, define available capacity, and set your pricing.",
      tbAction: "We instantly generate a high-converting, SEO-optimized microsite for your departure using our proprietary high-res imagery and standardized itineraries."
    },
    {
      id: 4,
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Discovery & Conversion",
      time: "Ongoing",
      outcome: "Trekkers find and book your departure.",
      operatorAction: "Keep your inventory up to date. If a batch fills up via your direct channels, sync the availability on TrekBazaar to avoid overbooking.",
      tbAction: "Our marketing engine runs targeted ads and SEO campaigns. We funnel high-intent traffic directly to your departures and handle the entire checkout flow."
    },
    {
      id: 5,
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: "Instant Bookings",
      time: "Real-time",
      outcome: "Manifest updated and funds secured.",
      operatorAction: "Receive instant email notifications. Download the live manifest list containing trekker emergency contacts, ages, and medical info for your trek leaders.",
      tbAction: "We process the payment via our secure gateway, issue the invoice to the customer on your behalf, and hold the funds safely in escrow."
    },
    {
      id: 6,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Automated Settlements",
      time: "Trek Completion + 3 Days",
      outcome: "Funds hit your bank account.",
      operatorAction: "Deliver an incredible, safe trekking experience on the mountain. Remind customers to leave a review.",
      tbAction: "Once the trek's return date passes, we automatically deduct our flat 12% commission and route the remaining 88% directly to your verified bank account via NEFT/IMPS."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <section className="bg-[#0F3D2E] text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-[#1B5E3C] rounded-full blur-[100px] opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
            The Operator Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            How TrekBazaar Works
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed font-medium max-w-2xl mx-auto">
            A radically transparent look at exactly what happens from the moment you click register to the moment money hits your bank account.
          </p>
        </div>
      </section>

      {/* The Journey - Linear/Stripe Inspired Timeline */}
      <section className="py-24 px-4 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Main vertical line for desktop */}
          <div className="hidden md:block absolute left-[28px] top-4 bottom-4 w-1 bg-zinc-200 rounded-full"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group">
                
                {/* Timeline Node */}
                <div className="hidden md:flex flex-col items-center z-10">
                  <div className="w-14 h-14 bg-[#1B5E3C] rounded-2xl flex items-center justify-center shadow-lg border-4 border-zinc-50 group-hover:scale-110 group-hover:bg-[#0F3D2E] transition-all duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Mobile Header (replaces node on small screens) */}
                <div className="md:hidden flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 bg-[#1B5E3C] rounded-xl flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                    {step.id}. {step.title}
                  </h2>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-3xl p-8 md:p-10 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
                  
                  {/* Desktop Title */}
                  <div className="hidden md:block mb-8">
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                      {step.id}. {step.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="inline-flex flex-col bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Estimated Time</span>
                      <span className="text-sm font-bold text-zinc-900">{step.time}</span>
                    </div>
                    <div className="inline-flex flex-col bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Expected Outcome</span>
                      <span className="text-sm font-bold text-emerald-900">{step.outcome}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 relative">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-100 -translate-x-1/2"></div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[#1B5E3C]"></div>
                        <h3 className="font-bold text-zinc-900 uppercase tracking-wide text-sm">Your Responsibility</h3>
                      </div>
                      <p className="text-zinc-600 leading-relaxed font-medium">
                        {step.operatorAction}
                      </p>
                    </div>
                    
                    <div className="relative">
                       <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                        <h3 className="font-bold text-zinc-900 uppercase tracking-wide text-sm">TrekBazaar&apos;s Job</h3>
                      </div>
                      <p className="text-zinc-600 leading-relaxed font-medium">
                        {step.tbAction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-emerald-50">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">
            Ready to upgrade your operations?
          </h2>
          <p className="text-xl text-zinc-600 mb-10 font-medium">
            Let us handle the technology, marketing, and payments so you can focus entirely on delivering life-changing experiences in the mountains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#1B5E3C] text-white font-black h-16 px-10 rounded-xl transition-all shadow-lg hover:-translate-y-1 text-lg">
              Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/partner/pricing" className="inline-flex items-center justify-center border-2 border-zinc-200 text-zinc-900 h-16 px-10 rounded-xl font-black hover:bg-zinc-50 transition-all text-lg">
              Understand Our Pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
