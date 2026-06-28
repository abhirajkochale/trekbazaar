import React from 'react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyStory({ company }: Props) {
  if (!company.description) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
            {company.description.split('\n').map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
