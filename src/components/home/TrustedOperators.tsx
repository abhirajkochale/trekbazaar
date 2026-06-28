"use client";

import React from 'react';
import Image from 'next/image';
import { Container } from '../layout/Container';
import { ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  companies: any[];
}

export function TrustedOperators({ companies }: Props) {
  if (!companies || companies.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Our Operator Network
            </h2>
            <p className="text-lg text-zinc-500 font-medium">
              We connect you exclusively with verified, highly-rated trekking companies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-6 rounded-3xl border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all flex flex-col items-start"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden mb-6">
                {company.logo_url ? (
                  <Image 
                    src={company.logo_url} 
                    alt={company.name} 
                    width={64} 
                    height={64} 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-zinc-400">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-1 line-clamp-1 group-hover:text-tb-primary transition-colors">
                {company.name}
              </h3>
              
              <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Verified Operator</span>
              </div>
              
              <div className="w-full h-[1px] bg-zinc-100 mb-4" />
              
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 text-sm font-bold text-zinc-900">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  4.9
                </div>
                <div className="text-sm font-medium text-zinc-500">
                  {company.established_year ? `${new Date().getFullYear() - company.established_year} yrs exp` : 'Top Rated'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
