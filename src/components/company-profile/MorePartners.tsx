import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partners: any[];
}

export function MorePartners({ partners }: Props) {
  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-zinc-100">
      <Container>
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">More Verified Partners</h2>
          <p className="text-zinc-500 mt-2 text-lg">Explore other trusted trekking operators on TrekBazaar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map(partner => (
            <Link 
              key={partner.id} 
              href={`/company/${partner.slug}`}
              className="group bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200 hover:border-tb-primary hover:shadow-lg transition-all"
            >
              <div className="aspect-[2/1] w-full relative bg-zinc-800">
                {partner.cover_image_url && (
                  <Image src={partner.cover_image_url} alt={partner.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                {/* Logo overlapping */}
                <div className="absolute -bottom-6 left-4 w-12 h-12 bg-white rounded-xl shadow-md p-1 border border-zinc-100 overflow-hidden">
                  {partner.logo_url ? (
                    <Image src={partner.logo_url} alt={partner.name} fill className="object-contain" />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400">{partner.name[0]}</div>
                  )}
                </div>
              </div>
              <div className="pt-10 pb-5 px-5">
                <h3 className="font-bold text-zinc-900 group-hover:text-tb-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                  {partner.name}
                  {partner.approval_status === 'approved' && <ShieldCheck className="w-4 h-4 text-tb-primary shrink-0" />}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
