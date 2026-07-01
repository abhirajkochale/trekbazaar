import React from 'react';
import Link from 'next/link';
import { 
  UserPlus, FileCheck, Mountain, Search, 
  CreditCard, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck, Lock
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | TrekBazaar Partners',
  description: 'Understand the exact transparent journey from registration to your first automated settlement on TrekBazaar.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: "Submit Application",
      time: "15 Minutes",
      outcome: "Application queued for Trust & Safety review.",
      operatorAction: "Complete the 4-step onboarding wizard. Upload your GST certificate, company PAN, and banking details. You will digitally sign the commercial agreement.",
      tbAction: "Our system securely encrypts your documents using bank-grade AES-256 encryption. Your profile is routed to our verification queue."
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Stringent Due Diligence",
      time: "24-48 Hours",
      outcome: "Account Activated & Verified Badge Awarded.",
      operatorAction: "Wait for approval. If we find discrepancies (e.g., bank name does not match GST name), we will request clarification via email.",
      tbAction: "Our Trust & Safety team manually verifies your business entity against government databases. We ensure you are a legitimate, safe operator."
    },
    {
      id: 3,
      icon: <Mountain className="w-6 h-6 text-white" />,
      title: "Publish Inventory",
      time: "5 Minutes per departure",
      outcome: "Departures go live on TrekBazaar.",
      operatorAction: "Log into your dashboard. Select from our Master Treks, set your dates, allocate capacity, define your own cancellation policy, and set your pricing.",
      tbAction: "We instantly generate a high-converting, SEO-optimized checkout page for your departure, powered by our premium itinerary content."
    },
    {
      id: 4,
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Discovery & Customer Acquisition",
      time: "Ongoing",
      outcome: "Trekkers find and book your departure.",
      operatorAction: "Keep your inventory up to date. (You are completely free to sell the same inventory via your own direct channels).",
      tbAction: "Our marketing engine runs targeted ads and dominates SEO. We funnel high-intent traffic directly to your departures."
    },
    {
      id: 5,
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: "Secured Bookings",
      time: "Real-time",
      outcome: "Customer pays 100% upfront.",
      operatorAction: "Receive an instant email. Download the live manifest list containing customer emergency contacts and medical declarations for your Trek Leaders.",
      tbAction: "We process the payment via Razorpay. We hold the funds safely in a nodal escrow account to protect both you and the customer."
    },
    {
      id: 6,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Automated Settlements",
      time: "Trek Completion + 3 Days",
      outcome: "Funds deposited in your bank.",
      operatorAction: "Deliver an incredible, safe trekking experience on the mountain. Remind customers to leave a review.",
      tbAction: "Once the trek concludes, we automatically deduct our flat 12% commission and route the remaining 88% directly to your verified bank account via NEFT/IMPS. No manual invoicing required."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <section className="bg-[#0F3D2E] text-white pt-32 pb-24 px-4 relative overflow-hidden border-b-[10px] border-[#D4AF37]">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-[#1B5E3C] rounded-full blur-[100px] opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md gap-2">
            <Lock className="w-4 h-4" /> Radical Transparency
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
            Exactly how the <br/><span className="text-[#D4AF37]">machine works.</span>
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed font-medium max-w-2xl mx-auto">
            You are trusting us with your revenue. In return, we owe you absolute clarity on exactly what happens at every step of the journey.
          </p>
        </div>
      </section>

      {/* The Journey - Linear/Stripe Inspired Timeline */}
      <section className="py-24 px-4 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto relative">
          
          <div className="hidden md:block absolute left-[36px] top-4 bottom-4 w-1 bg-zinc-200 rounded-full"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step) => (
              <div key={step.id} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group">
                
                {/* Timeline Node */}
                <div className="hidden md:flex flex-col items-center z-10 mt-6">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border-4 border-zinc-100 group-hover:scale-110 group-hover:border-[#D4AF37] transition-all duration-500">
                    <div className="w-14 h-14 bg-[#0F3D2E] rounded-xl flex items-center justify-center">
                       {step.icon}
                    </div>
                  </div>
                </div>

                {/* Mobile Header (replaces node on small screens) */}
                <div className="md:hidden flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 bg-[#0F3D2E] rounded-xl flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                    {step.id}. {step.title}
                  </h2>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300">
                  
                  {/* Desktop Title */}
                  <div className="hidden md:block mb-10">
                    <div className="text-[#1B5E3C] font-black text-lg mb-2 uppercase tracking-widest">Step {step.id}</div>
                    <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
                      {step.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-10">
                    <div className="inline-flex flex-col bg-zinc-50 border border-zinc-200 px-5 py-3 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Estimated Time</span>
                      <span className="text-base font-black text-zinc-900">{step.time}</span>
                    </div>
                    <div className="inline-flex flex-col bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Expected Outcome</span>
                      <span className="text-base font-black text-emerald-900">{step.outcome}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10 relative">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-100 -translate-x-1/2"></div>
                    
                    <div className="relative md:pr-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-sm border border-zinc-200">You</div>
                        <h3 className="font-black text-zinc-900 tracking-wide text-lg">Your Responsibility</h3>
                      </div>
                      <p className="text-zinc-600 leading-relaxed font-medium text-lg">
                        {step.operatorAction}
                      </p>
                    </div>
                    
                    <div className="relative md:pl-4">
                       <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#0F3D2E] flex items-center justify-center font-bold text-[#D4AF37] text-sm border border-[#1B5E3C]">TB</div>
                        <h3 className="font-black text-zinc-900 tracking-wide text-lg">Our Job</h3>
                      </div>
                      <p className="text-zinc-600 leading-relaxed font-medium text-lg">
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

      {/* SERVICE LEVEL EXPECTATIONS */}
      <section className="py-24 bg-zinc-900 text-white">
         <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tight">What happens after you join?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
               <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-3">Partner Support</h4>
                  <p className="text-zinc-300 font-medium leading-relaxed">You get access to a dedicated Partner Success inbox. We resolve operational disputes and platform issues within 12 hours.</p>
               </div>
               <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-3">Continuous Updates</h4>
                  <p className="text-zinc-300 font-medium leading-relaxed">You automatically get new dashboard features, better analytics, and upgraded checkout flows at zero additional cost.</p>
               </div>
               <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-xl font-bold text-[#D4AF37] mb-3">Performance Data</h4>
                  <p className="text-zinc-300 font-medium leading-relaxed">Every month, you receive analytics on how your conversion rates compare to the marketplace average, helping you price better.</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-emerald-50">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-5xl font-black text-zinc-900 mb-6 tracking-tight leading-[1.1]">
            Ready to upgrade your operations?
          </h2>
          <p className="text-xl text-zinc-600 mb-12 font-medium max-w-2xl mx-auto">
            Let us handle the technology, marketing, and payments so you can focus entirely on delivering life-changing experiences on the mountain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partner/register" className="inline-flex items-center justify-center bg-[#0F3D2E] hover:bg-[#1B5E3C] text-white font-black h-16 px-12 rounded-xl transition-all shadow-[0_0_30px_-10px_rgba(15,61,46,0.5)] hover:-translate-y-1 text-lg">
              Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
