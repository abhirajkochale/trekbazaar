"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDuration, difficultyLabel, difficultyBadgeClasses } from '@/lib/format';
import { Calendar, MapPin, Users, ShieldCheck, CheckCircle2, Navigation, Coffee, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pkg: any;
}

export function MarketplaceCard({ pkg }: Props) {
  const company = pkg.companies;
  const departures = pkg.departures || [];
  const earliestDeparture = departures[0];
  const upcomingCount = departures.length;
  
  const availableSeats = earliestDeparture 
    ? earliestDeparture.total_seats - earliestDeparture.booked_seats 
    : 0;

  const inclusions = pkg.included || [];
  const hasMeals = inclusions.some((i: string) => i.toLowerCase().includes('meal') || i.toLowerCase().includes('food') || i.toLowerCase().includes('breakfast'));
  const hasTransport = inclusions.some((i: string) => i.toLowerCase().includes('transport') || i.toLowerCase().includes('pickup') || i.toLowerCase().includes('travel'));
  const hasGuide = inclusions.some((i: string) => i.toLowerCase().includes('guide') || i.toLowerCase().includes('leader') || i.toLowerCase().includes('expert'));

  // Calculate discount
  const basePrice = earliestDeparture?.base_price || pkg.price_per_person;
  const offerPrice = earliestDeparture?.offer_price;
  const hasDiscount = offerPrice && offerPrice < basePrice;
  const discountPercent = hasDiscount ? Math.round(((basePrice - offerPrice) / basePrice) * 100) : 0;
  const displayPrice = hasDiscount ? offerPrice : basePrice;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-tb-medium flex flex-col md:flex-row transition-all relative"
    >
      {company?.featured && (
        <div className="absolute top-0 left-0 bg-tb-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-br-lg z-10">
          Featured Partner
        </div>
      )}

      {/* Left: Company & Basic Info */}
      <div className="p-6 md:p-8 flex-1 flex flex-col pt-8">
        <div className="flex items-start gap-4 mb-5">
          {company?.logo_url ? (
            <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-zinc-100 bg-white shrink-0 shadow-sm">
              <Image src={company.logo_url} alt={company.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xl shrink-0 shadow-sm">
              {company?.name?.[0] || 'T'}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-1.5 flex-wrap">
              {company?.name || 'Unknown Operator'}
              {company?.verification_status === 'verified' && (
                <span title="Verified Operator">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-4 h-4 fill-current" /> 4.8 <span className="text-zinc-400 font-normal">(124)</span>
              </div>
              {company?.years_of_experience > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{company.years_of_experience} yrs exp</span>
                </>
              )}
            </div>
          </div>
        </div>

        <h4 className="text-lg font-bold text-zinc-900 mb-2">{pkg.title}</h4>
        
        <p className="text-sm text-zinc-600 mb-6 line-clamp-2 leading-relaxed">
          {company?.description || pkg.short_description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm mt-auto pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">{formatDuration(pkg.duration_days)}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">{pkg.start_point || 'Not specified'}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${difficultyBadgeClasses(pkg.difficulty)}`}>
            <span className="font-medium">{difficultyLabel(pkg.difficulty)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2">
          {hasGuide && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Certified Leaders
            </div>
          )}
          {hasMeals && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-700">
              <Coffee className="w-4 h-4" /> Meals Included
            </div>
          )}
          {hasTransport && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-700">
              <Navigation className="w-4 h-4" /> Transport Included
            </div>
          )}
        </div>
      </div>

      {/* Right: Price & Departures */}
      <div className="bg-zinc-50 md:w-[320px] p-6 md:p-8 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-zinc-200">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Price</span>
            {hasDiscount && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </div>
          
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-zinc-900">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-lg text-zinc-400 line-through mb-1">{formatPrice(basePrice)}</span>
            )}
          </div>
          <span className="text-xs text-zinc-500 mt-1 block">per person</span>
        </div>

        <div className="space-y-4 mb-8 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex items-start gap-3 text-sm">
            <Calendar className="w-5 h-5 text-tb-primary shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 block mb-0.5">Next Departure</span>
              <span className="text-zinc-600 block">
                {earliestDeparture 
                  ? new Date(earliestDeparture.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'No dates scheduled'}
              </span>
              {upcomingCount > 0 && (
                <span className="text-xs text-tb-primary font-medium mt-1 block">
                  +{upcomingCount - 1} more date{upcomingCount - 1 !== 1 ? 's' : ''} available
                </span>
              )}
            </div>
          </div>

          {earliestDeparture && (
            <div className="flex items-center gap-3 text-sm pt-3 border-t border-zinc-100">
              <Users className="w-5 h-5 text-tb-primary shrink-0" />
              <div className="text-zinc-600">
                <span className="font-semibold text-zinc-900">{availableSeats}</span> seats left
              </div>
            </div>
          )}
        </div>

        <Link 
          href={`/treks/${pkg.slug}`}
          className="mt-auto w-full inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-xl bg-tb-primary text-white hover:bg-tb-primary-hover hover:shadow-md h-12 px-6 text-base"
        >
          View Itinerary
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </motion.div>
  );
}
