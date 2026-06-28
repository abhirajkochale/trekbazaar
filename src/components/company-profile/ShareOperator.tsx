"use client";

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function ShareOperator({ company }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${company.name} on TrekBazaar`,
      text: `Check out ${company.name}'s treks and itineraries on TrekBazaar.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-white border-t border-zinc-100 mb-20">
      <Container>
        <div className="max-w-4xl bg-zinc-950 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tb-primary/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Share this operator</h2>
            <p className="text-zinc-400 font-medium max-w-md">
              Know someone looking for a great trek? Share {company.name}&apos;s profile directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-bold rounded-full hover:bg-zinc-100 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share Profile
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
