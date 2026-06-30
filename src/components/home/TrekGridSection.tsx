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
    <section className="py-24 md:py-32 bg-white">
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

        <div className="relative group">
          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar gap-4 md:gap-6 pb-8 -mx-4 px-4 scroll-pl-4 md:mx-0 md:px-0 md:scroll-pl-0">
            {treks.map((trek, idx) => {
              const href = trek.company_slug 
                ? `/company/${trek.company_slug}/${trek.slug}` 
                : `/master-treks/${trek.slug}`;

              return (
                <motion.div
                  key={trek.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="shrink-0 w-[65vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-start snap-always"
                >
                  <MasterTrekSearchCard masterTrek={trek} className="h-full w-full" href={href} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
