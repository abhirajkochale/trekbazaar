"use client";

import React, { useState, useRef, useTransition } from 'react';
import { acceptTermsAction } from './actions';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function TermsForm({ companyId, currentVersion, alreadyAccepted }: { companyId: string, currentVersion: string, alreadyAccepted: boolean }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(alreadyAccepted);
  const [agreed, setAgreed] = useState(alreadyAccepted);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleScroll = () => {
    if (hasScrolledToBottom) return;
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Added a 10px buffer
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleContinue = () => {
    if (!agreed) {
      toast.error("You must agree to the terms to continue");
      return;
    }

    startTransition(async () => {
      const result = await acceptTermsAction(companyId, currentVersion);
      if (result.success) {
        toast.success("Terms accepted");
        router.push("/partner/onboarding/banking");
      } else {
        toast.error(result.error || "Failed to accept terms");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col h-[600px]">
        <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">TrekBazaar Partner Agreement</h2>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">Version {currentVersion}</p>
          </div>
          {!hasScrolledToBottom && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              <AlertCircle className="w-3 h-3" /> Scroll to read
            </span>
          )}
        </div>
        
        {/* Scrollable Terms Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-8 overflow-y-auto flex-1 prose prose-zinc max-w-none text-sm text-zinc-600 prose-headings:text-zinc-900 prose-headings:font-bold prose-h3:text-lg prose-h3:mt-8 prose-p:leading-relaxed"
        >
          <p className="lead font-medium text-zinc-900">
            Welcome to TrekBazaar. By joining our platform, you agree to uphold the highest standards of safety, quality, and reliability for trekkers across India.
          </p>
          
          <h3>1. Marketplace Responsibilities</h3>
          <p>TrekBazaar acts as a discovery and booking facilitator. We are responsible for marketing, payment processing, and providing the technology platform to connect you with trekkers. We do not operate the treks and are not liable for on-ground execution.</p>

          <h3>2. Partner Responsibilities</h3>
          <p>As a verified partner, you are solely responsible for the safe and professional execution of all booked itineraries. You must maintain valid permits, employ certified guides, and ensure emergency protocols are in place.</p>
          
          <h3>3. Commission Model & Settlement</h3>
          <p>TrekBazaar charges a standard platform fee on all successful bookings. Payouts are settled to your registered bank account on a T+3 basis after the trek completion date, ensuring customer satisfaction before fund release.</p>

          <h3>4. Cancellation & Refund Policy</h3>
          <p>Partners must honor the cancellation policies displayed at the time of booking. TrekBazaar will process refunds automatically according to the selected policy bracket. Last-minute operator cancellations will incur a penalty equivalent to 10% of the booking value to compensate the customer.</p>

          <h3>5. Safety & Medical Protocol</h3>
          <p>You agree to carry a standardized medical kit, including supplemental oxygen for high-altitude treks above 10,000 ft. Your Trek Leaders must hold valid Basic Mountaineering Course (BMC) and Wilderness First Responder (WFR) certifications.</p>

          <h3>6. Code of Conduct & Suspension</h3>
          <p>Any violation of the leave-no-trace policy, failure to deliver promised services, or unprofessional behavior towards customers will result in an immediate investigation. TrekBazaar reserves the right to suspend or permanently remove partners who repeatedly breach these terms.</p>

          <p className="mt-12 text-center text-xs text-zinc-400">End of Document</p>
        </div>
        
        <div className="p-6 border-t border-zinc-200 bg-zinc-50">
          <label className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
            agreed ? 'bg-zinc-900 border-zinc-900 text-white' : 
            hasScrolledToBottom ? 'bg-white border-zinc-300 hover:border-zinc-400 text-zinc-700' : 
            'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-60'
          }`}>
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                disabled={!hasScrolledToBottom}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer w-5 h-5 appearance-none rounded border-2 border-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 focus:ring-offset-white disabled:opacity-50"
              />
              <CheckCircle2 className={`absolute w-5 h-5 pointer-events-none transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <div>
              <div className={`font-bold ${agreed ? 'text-white' : 'text-zinc-900'}`}>I have read and agree to the Commercial Agreement</div>
              <p className={`text-xs mt-1 ${agreed ? 'text-zinc-300' : 'text-zinc-500'}`}>This acts as a binding digital signature.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleContinue}
          disabled={!agreed || isPending}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept & Continue'}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
