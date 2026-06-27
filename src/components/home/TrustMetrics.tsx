"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';

interface Props {
  operatorsCount?: number;
  departuresCount?: number;
  destinationsCount?: number;
}

export function TrustMetrics({ operatorsCount = 20, departuresCount = 100, destinationsCount = 5 }: Props) {
  const metrics = [
    { label: 'Verified Operators', value: `${operatorsCount}+` },
    { label: 'Upcoming Departures', value: `${departuresCount}+` },
    { label: 'Destinations', value: `${destinationsCount}+` },
    { label: 'Lowest Price', value: 'Guaranteed' },
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
              className="flex flex-col items-center justify-center text-center px-2 md:px-4"
            >
              <span className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-2 md:mb-3">
                {metric.value}
              </span>
              <span className="text-xs md:text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
