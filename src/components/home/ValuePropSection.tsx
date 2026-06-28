"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { Compass, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export function ValuePropSection() {
  const steps = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-tb-primary" strokeWidth={1.5} />,
      title: "Verified Companies",
      description: "We handpick and verify every trekking operator before they can list on TrekBazaar, ensuring your safety.",
    },
    {
      icon: <Compass className="w-8 h-8 text-tb-primary" strokeWidth={1.5} />,
      title: "Compare Operators",
      description: "Don't settle for the first quote. Compare prices, itineraries, and reviews across multiple operators for the same trek.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-tb-primary" strokeWidth={1.5} />,
      title: "Lowest Available Price",
      description: "Book directly with operators at their lowest available prices, secured instantly by our payment platform.",
    }
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            India&apos;s marketplace for <br className="hidden md:block" /> Himalayan trekking.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            TrekBazaar is India&apos;s first dedicated marketplace for trekking. Stop relying on scattered WhatsApp forwards. Discover, compare, and book verified operators in one place.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-100 group-hover:bg-white group-hover:shadow-md transition-all group-hover:scale-105 duration-300">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-3">{step.title}</h3>
              <p className="text-base md:text-lg text-zinc-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
