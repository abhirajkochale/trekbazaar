"use client";

import React from 'react';
import { Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { CompanyCard } from '../public/companies/CompanyCard';
import type { PublicCompany } from '@/lib/public/companies';
import Link from 'next/link';

interface Props {
  companies: PublicCompany[];
  title?: string;
  subtitle?: string;
}

export function TrustedOperators({ companies, title = "Explore Trekking Companies", subtitle = "Connect directly with verified, highly-rated trekking operators across India." }: Props) {
  if (!companies || companies.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>
          <Link 
            href="/companies"
            className="inline-flex items-center justify-center px-6 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-full hover:bg-zinc-200 transition-colors"
          >
            View All Partners
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
