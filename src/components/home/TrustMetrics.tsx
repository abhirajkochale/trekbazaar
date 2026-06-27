"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';

export function TrustMetrics() {
  const metrics = [
    { label: 'Verified Operators', value: '50+' },
    { label: 'Destinations', value: '120+' },
    { label: 'Happy Trekkers', value: '10k+' },
    { label: 'Safety Record', value: '100%' },
  ];

  return (
    <section className="bg-white border-b border-zinc-100 py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {metrics.map((metric, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx} 
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <span className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-3">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
