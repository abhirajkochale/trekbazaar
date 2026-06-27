"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';

export function WhyChooseUs() {
  const reasons = [
    {
      title: 'Verified Operators',
      description: 'Every trekking company on our platform undergoes a rigorous 14-point safety and quality check before listing.',
      icon: (
        <svg className="w-8 h-8 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees. What you see is what you pay. We break down exactly what is included and excluded in every trek.',
      icon: (
        <svg className="w-8 h-8 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Expert Support',
      description: 'Not sure which trek is right for you? Our Himalayan experts are available to guide you based on your fitness and experience.',
      icon: (
        <svg className="w-8 h-8 text-tb-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 md:py-32 bg-white">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
            The New Standard in Trekking
          </h2>
          <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium">
            We built TrekBazaar because finding a safe, reliable trek shouldn&apos;t be harder than the trek itself. Here is how we protect your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {reasons.map((reason, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
              key={index} 
              className="flex flex-col text-center items-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{reason.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
