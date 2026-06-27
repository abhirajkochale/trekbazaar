"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { MasterTrekSearchCard } from '../search/MasterTrekSearchCard';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
}

export function TrekGridSection({ title, subtitle, treks }: Props) {
  if (!treks || treks.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">{title}</h2>
            {subtitle && <p className="mt-3 text-lg text-zinc-500 font-medium">{subtitle}</p>}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {treks.map((trek, idx) => (
            <motion.div
              key={trek.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <MasterTrekSearchCard masterTrek={trek} className="h-full" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
