import React from 'react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
}

export function CompanyOverview({ company }: Props) {
  if (!company.description) return null;

  return (
    <section className="py-12 bg-white border-t border-zinc-100">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">About {company.name}</h2>
          <div className="prose prose-zinc prose-lg text-zinc-600 leading-relaxed font-medium">
            <p>
              {company.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
