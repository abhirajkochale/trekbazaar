"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MapPin, CalendarDays, TrendingUp, Compass, Share2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { Container } from '@/components/layout/Container';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any;
  stats: {
    totalActiveTreks: number;
    upcomingDepartures: number;
    lowestPrice: number | null;
  };
}

export function CompanyHeroMicrosite({ company, stats }: Props) {
  const handleScrollToTreks = () => {
    document.getElementById('all-treks')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Trek with ${company.name}`,
          text: company.description?.substring(0, 100) || `Book amazing Himalayan treks with ${company.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="relative bg-white pt-8 pb-16 border-b border-zinc-100">
      <Container>
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-zinc-900 shadow-2xl">
          {/* Cover Image */}
          <div className="absolute inset-0 z-0">
            {company.cover_image_url ? (
              <Image
                src={company.cover_image_url}
                alt={`${company.name} Cover`}
                fill
                className="object-cover opacity-60 mix-blend-overlay"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          </div>

          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-20 lg:px-16 lg:py-24 flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Logo */}
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white rounded-3xl p-2 shadow-[0_0_40px_rgba(0,0,0,0.3)] ring-4 ring-white/10 overflow-hidden relative z-20">
              {company.logo_url ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image src={company.logo_url} alt={company.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-zinc-100 flex items-center justify-center text-4xl font-black text-zinc-300">
                  {company.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  {company.name}
                </h1>
                {company.approval_status === 'approved' && (
                  <div className="flex items-center gap-1.5 bg-tb-primary/20 backdrop-blur-md text-white border border-tb-primary/30 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-tb-primary fill-white" />
                    Verified
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-zinc-300 font-medium text-sm md:text-base">
                {(company.city || company.state) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {[company.city, company.state].filter(Boolean).join(', ')}
                  </span>
                )}
                {company.years_of_experience > 0 && (
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    Operating Since {new Date().getFullYear() - company.years_of_experience}
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0 shrink-0">
              <button 
                onClick={handleScrollToTreks}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-tb-primary hover:bg-tb-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(11,193,132,0.3)]"
              >
                <Compass className="w-5 h-5" /> Browse Treks
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition-all active:scale-95"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
            <span className="text-3xl font-black text-zinc-900 mb-1">{stats.totalActiveTreks}</span>
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Active Treks</span>
          </div>
          
          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
            <span className="text-3xl font-black text-zinc-900 mb-1 flex items-center gap-2">
              {stats.upcomingDepartures} <CalendarDays className="w-6 h-6 text-tb-primary" />
            </span>
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Upcoming Departures</span>
          </div>

          <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
            {stats.lowestPrice ? (
              <span className="text-3xl font-black text-zinc-900 mb-1">{formatPrice(stats.lowestPrice)}</span>
            ) : (
              <span className="text-xl font-bold text-zinc-400 mb-1">N/A</span>
            )}
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Starting Price</span>
          </div>
          
          <div className="bg-tb-primary/10 border border-tb-primary/20 p-6 rounded-2xl flex flex-col justify-center shadow-sm relative overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-tb-primary/10 rotate-12" />
            <span className="text-3xl font-black text-tb-primary mb-1 relative z-10">100%</span>
            <span className="text-sm font-bold text-tb-primary/80 uppercase tracking-wider relative z-10">Verified Partner</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
