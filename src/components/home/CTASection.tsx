import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../layout/Container';

export function CTASection() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image 
        src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=2400"
        alt="Trekkers walking on a mountain ridge"
        fill
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Heavy Gradient Overlay for legibility */}
      <div className="absolute inset-0 bg-black/70" />
      
      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Ready for the ascent?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of trekkers who have found their perfect Himalayan adventure through TrekBazaar. Your next great story starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/search"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-tb-text-primary bg-white hover:bg-tb-sys-background rounded-full transition-colors shadow-xl"
            >
              Start Exploring
            </Link>
            <Link 
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-full transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
