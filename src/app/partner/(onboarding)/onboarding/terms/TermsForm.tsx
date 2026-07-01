"use client";

import React, { useState, useTransition } from 'react';
import { acceptTermsAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const TERMS_SECTIONS = [
  {
    id: "welcome",
    title: "Welcome to TrekBazaar",
    content: "By joining TrekBazaar, you become part of India's most trusted network of high-altitude trek operators. We are committed to growing your business while you focus on delivering exceptional experiences."
  },
  {
    id: "responsibilities",
    title: "Marketplace Responsibilities",
    content: "TrekBazaar is responsible for generating demand, processing payments, managing the itinerary (Master Treks) SEO, and providing tier-1 customer support. You are responsible for executing the trek safely, managing your guides, and adhering to the published itinerary."
  },
  {
    id: "financials",
    title: "Commission & Settlement Cycle",
    content: "TrekBazaar charges a standard 15% commission on all successful bookings. Settlements are processed every Tuesday for all treks completed in the previous week (Monday to Sunday). Payouts are made directly to your registered bank account."
  },
  {
    id: "cancellation",
    title: "Cancellation & Refund Policy",
    content: "If a customer cancels 30+ days before departure, a 10% cancellation fee applies. Within 15-30 days, 50%. Less than 15 days, no refund. If YOU cancel a departure, you are liable to provide a 100% refund immediately, and excessive cancellations may result in suspension."
  },
  {
    id: "safety",
    title: "Safety & Compliance",
    content: "You must ensure all guides are certified (Basic/Advanced Mountaineering Course), carry adequate first-aid, oxygen cylinders, and communication devices for high-altitude treks. You must hold valid liability insurance if required by local authorities."
  }
];

export function TermsForm({ companyId }: { companyId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("welcome");
  const [hasAgreed, setHasAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    startTransition(async () => {
      const result = await acceptTermsAction(companyId, "v1.0.0");
      if (result.success) {
        setIsComplete(true);
        setTimeout(() => {
          router.push("/partner/onboarding/banking");
        }, 1200);
      } else {
        toast.error(result.error || "Failed to accept terms");
      }
    });
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Agreement Accepted</h2>
        <p className="text-zinc-500 font-medium mt-2">Moving to Bank Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      
      <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 bg-zinc-100 px-4 py-2 rounded-lg w-fit">
        <Clock className="w-4 h-4" />
        <span>Estimated reading time: 4 minutes</span>
      </div>

      <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        {TERMS_SECTIONS.map((section, idx) => (
          <div key={section.id} className={`border-b border-zinc-200 last:border-0`}>
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 transition-colors"
            >
              <span className="font-bold text-zinc-900">{idx + 1}. {section.title}</span>
              <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out`}
              style={{ maxHeight: openSection === section.id ? '500px' : '0' }}
            >
              <div className="p-6 pt-0 text-sm font-medium text-zinc-600 leading-relaxed">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-1">
            <input 
              type="checkbox"
              className="peer sr-only"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
            />
            <div className="w-6 h-6 rounded-md border-2 border-zinc-300 peer-checked:bg-zinc-900 peer-checked:border-zinc-900 transition-all flex items-center justify-center group-hover:border-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <div>
            <span className="font-bold text-zinc-900 block mb-1">I accept the Commercial Terms</span>
            <span className="text-sm font-medium text-zinc-500 block">By checking this box, you digitally sign the B2B marketplace agreement. A copy will be emailed to you.</span>
          </div>
        </label>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-zinc-200 py-4 px-4 sm:px-6 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-700">You are almost ready to join TrekBazaar.</span>
          </div>
          <button 
            onClick={handleContinue}
            disabled={!hasAgreed || isPending}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept & Continue'}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
