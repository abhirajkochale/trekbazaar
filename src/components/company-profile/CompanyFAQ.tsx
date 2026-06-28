"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyFAQ({ company }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Hide if no structured FAQ data exists
  if (!company.faqs || !Array.isArray(company.faqs) || company.faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-zinc-50 border-b border-zinc-100">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-500 text-lg">Everything you need to know about trekking with {company.name}</p>
          </div>

          <div className="space-y-4">
            {company.faqs.map((faq: any, idx: number) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className={`bg-white border transition-colors rounded-2xl overflow-hidden ${isOpen ? 'border-tb-primary shadow-md' : 'border-zinc-200 shadow-sm hover:border-zinc-300'}`}>
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={`font-bold text-lg ${isOpen ? 'text-tb-primary' : 'text-zinc-900'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-tb-primary' : 'text-zinc-400'}`} />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-zinc-600 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
