"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { Shield, Headphones, Banknote, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function MarketplaceGuarantee() {
  const features = [
    {
      icon: <CheckCircle className="w-4 h-4 text-white" strokeWidth={1.5} />,
      title: "Vetted Operators",
      description: "Every operator passes a strict 10-point quality check."
    },
    {
      icon: <Search className="w-4 h-4 text-white" strokeWidth={1.5} />,
      title: "Compare Prices",
      description: "Transparent pricing with no hidden fees."
    },
    {
      icon: <Shield className="w-4 h-4 text-white" strokeWidth={1.5} />,
      title: "Secure Booking",
      description: "Bank-grade encryption for all your payments."
    },
    {
      icon: <Banknote className="w-4 h-4 text-white" strokeWidth={1.5} />,
      title: "Best Value",
      description: "Lowest price guarantee across all itineraries."
    },
    {
      icon: <Headphones className="w-4 h-4 text-white" strokeWidth={1.5} />,
      title: "Expert Support",
      description: "24/7 assistance from real Himalayan trekkers."
    }
  ];

  return (
    <section className="bg-zinc-950 py-24 md:py-32 relative overflow-hidden">
      {/* Abstract Background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-tb-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="inline-block text-tb-primary font-bold tracking-widest uppercase text-sm mb-4">
            The TrekBazaar Guarantee
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            India&apos;s most trusted trekking marketplace.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            We don&apos;t run treks—we bring the best independent operators together in one place. Compare itineraries, verify credentials, and book with absolute confidence.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center max-w-[200px]"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
