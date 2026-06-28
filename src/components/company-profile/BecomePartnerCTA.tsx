import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export function BecomePartnerCTA() {
  return (
    <section className="py-20 bg-zinc-900 text-center">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Want a booking website like this?</h2>
          <p className="text-zinc-400 text-lg mb-8 font-medium">
            Join TrekBazaar's partner network to instantly receive your own verified storefront, booking engine, and SEO-optimized web pages.
          </p>
          <Link 
            href="/partner"
            className="inline-flex items-center justify-center gap-2 bg-tb-primary hover:bg-tb-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-transform active:scale-95 shadow-lg"
          >
            Become a TrekBazaar Partner <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
