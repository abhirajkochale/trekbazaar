"use client";

import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check, MessageSquare, Users, Briefcase, MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function ShareOperator({ company }: Props) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trek with ${company.name} on TrekBazaar`,
          text: `Check out ${company.name}'s verified trekking packages on TrekBazaar.`,
          url,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`Check out ${company.name} on TrekBazaar!`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <section className="py-16 md:py-24 bg-zinc-50 border-b border-zinc-100 text-center">
      <Container>
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 shadow-xl relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-tb-primary/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
              <Share2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">Share {company.name}</h2>
            <p className="text-zinc-500 text-lg mb-8 font-medium">
              Help your friends discover verified treks by sharing this storefront.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button 
                onClick={handleNativeShare}
                className="w-full sm:w-auto bg-tb-primary hover:bg-tb-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" /> Share Profile
              </button>
              
              <button 
                onClick={handleCopyLink}
                className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-8 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <LinkIcon className="w-5 h-5" />} 
                {copied ? 'Copied to clipboard' : 'Copy Link'}
              </button>
            </div>

            {/* Social Icons */}
            <div className="pt-8 border-t border-zinc-100 flex flex-wrap justify-center gap-4">
              <a href={`https://wa.me/?text=${shareText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors" aria-label="Share on WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors" aria-label="Share on Telegram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.18 3.44-.49.34-.93.5-1.32.49-.43-.01-1.26-.24-1.87-.44-.75-.24-1.34-.37-1.29-.79.03-.22.33-.44.92-.66 3.59-1.56 5.98-2.59 7.18-3.09 3.43-1.43 4.14-1.68 4.6-1.68.1 0 .32.02.44.13.1.09.13.22.14.31-.01.03.01.12 0 .19z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black/5 text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors" aria-label="Share on X">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" aria-label="Share on Facebook">
                <Users className="w-5 h-5" />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" aria-label="Share on LinkedIn">
                <Briefcase className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
