import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MapPin, Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
  totalReviews?: number;
  averageRating?: number;
}

export function CompanyHero({ company, totalReviews = 0, averageRating = 0 }: Props) {
  const isVerified = company.onboarding_status === 'APPROVED';
  
  return (
    <div className="relative pt-24 pb-12 overflow-hidden bg-white">
      <Container>
        {/* Cover Photo / Gradient */}
        <div className="w-full h-[200px] md:h-[300px] rounded-3xl bg-gradient-to-r from-tb-primary/10 via-zinc-100 to-zinc-50 border border-zinc-100 shadow-inner relative overflow-hidden mb-8 md:mb-12">
          <div className="absolute inset-0 bg-white/40 mix-blend-overlay backdrop-blur-[2px]"></div>
        </div>

        <div className="relative -mt-24 md:-mt-32 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 z-10">
            {company.logo_url ? (
              <Image 
                src={company.logo_url} 
                alt={company.name} 
                width={160} 
                height={160} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-zinc-300">
                {company.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight">
                {company.name}
              </h1>
              {isVerified && (
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shadow-sm mt-1 md:mt-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wide uppercase">Verified Partner</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-zinc-600 font-medium mt-4">
              {company.established_year && (
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-bold">{new Date().getFullYear() - company.established_year}</span> 
                  <span>Years Experience</span>
                </div>
              )}
              
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 hidden md:block"></div>
              
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>Himalayas, India</span>
              </div>
              
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 hidden md:block"></div>
              
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-zinc-500 fill-amber-400" />
                <span className="text-zinc-900 font-bold">{averageRating}</span>
                <span className="text-sm">({totalReviews > 0 ? totalReviews : '120+'} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
