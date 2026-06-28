"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDuration } from '@/lib/format';
import { Calendar, MapPin, Users, ShieldCheck, CheckCircle2, Navigation, Coffee, Star, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/providers/WishlistProvider';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pkg: any;
  isSelectedForCompare?: boolean;
  onCompareToggle?: (id: string) => void;
}

export function MarketplaceCard({ pkg, isSelectedForCompare, onCompareToggle }: Props) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-black/5 flex flex-col md:flex-row transition-all relative"
    >
      {company?.featured && !onCompareToggle && (
        <div className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 shadow-sm">
          Featured Partner
        </div>
      )}

      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isInWishlist(pkg.id)) {
            removeFromWishlist(pkg.id);
          } else {
            addToWishlist(pkg.id);
          }
        }}
        className={`absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white text-zinc-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 transition-colors ${onCompareToggle ? 'mt-4' : ''}`}
        aria-label={isInWishlist(pkg.id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isInWishlist(pkg.id) ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Left: Company & Basic Info */}
      <div className="p-6 md:p-8 flex-1 flex flex-col pt-10 md:pt-8">
        {onCompareToggle && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={isSelectedForCompare}
              onChange={() => onCompareToggle(pkg.id)}
              className="w-5 h-5 rounded text-tb-primary border-zinc-300 focus:ring-tb-primary cursor-pointer shadow-sm"
              id={`compare-${pkg.id}`}
            />
            <label htmlFor={`compare-${pkg.id}`} className="text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
              Compare
            </label>
          </div>
        )}

        <div className={`flex items-start gap-5 mb-6 ${onCompareToggle ? 'mt-4' : ''}`}>
          {company?.logo_url ? (
            <div className="w-16 h-16 relative rounded-2xl overflow-hidden border border-zinc-100 bg-white shrink-0 shadow-sm">
              <Image src={company.logo_url} alt={company.name} fill sizes="64px" className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-2xl shrink-0 shadow-sm border border-zinc-200/50">
              {company?.name?.[0] || 'T'}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-zinc-900 text-xl flex items-center gap-2 flex-wrap">
              {company?.name || 'Unknown Operator'}
              {company?.verification_status === 'verified' && (
                <span title="Verified Operator" className="text-tb-primary">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3 text-sm text-zinc-600 mt-1.5 font-medium">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" /> 4.9 <span className="text-zinc-400 font-normal">(128 reviews)</span>
              </div>
              {company?.years_of_experience > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{company.years_of_experience} yrs experience</span>
                </>
              )}
            </div>
          </div>
        </div>

        <h4 className="text-xl font-bold text-zinc-900 mb-2">{pkg.title}</h4>
        
        <p className="text-sm text-zinc-500 mb-6 line-clamp-2 leading-relaxed font-medium">
          {company?.description || pkg.short_description || 'No description provided.'}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm mt-auto pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-1.5 text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 font-medium">
            <Clock className="w-4 h-4 text-zinc-400" />
            {formatDuration(pkg.duration_days)}
          </div>
          <div className="flex items-center gap-1.5 text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 font-medium">
            <MapPin className="w-4 h-4 text-zinc-400" />
            {pkg.start_point || 'Not specified'}
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-x-6 gap-y-3">
          {hasGuide && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Certified Leaders
            </div>
          )}
          {hasMeals && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Coffee className="w-4 h-4" /> Meals Included
            </div>
          )}
          {hasTransport && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Navigation className="w-4 h-4" /> Transport Included
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 w-full mt-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
            {pkg.cancellation_policy || 'Flexible Cancellation Policy'}
          </div>
        </div>
      </div>

      {/* Right: Price & Departures */}
      <div className="bg-white md:bg-zinc-50 md:w-[320px] p-6 md:p-8 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-zinc-100 justify-between">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Total Price</span>
            {hasDiscount && (
              <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2 py-1 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {hasDiscount && (
              <span className="text-sm text-zinc-400 line-through font-medium">{formatPrice(basePrice)}</span>
            )}
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-zinc-900 tracking-tight">{formatPrice(displayPrice)}</span>
              <span className="text-sm text-zinc-500 font-medium mb-1">/person</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8 bg-zinc-50 md:bg-white p-5 rounded-2xl border border-zinc-200/60 shadow-sm">
          <div className="flex items-start gap-3 text-sm">
            <Calendar className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 block mb-1">Next Departure</span>
              <span className="text-zinc-600 font-medium block">
                {earliestDeparture 
                  ? new Date(earliestDeparture.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'No dates scheduled'}
              </span>
              {upcomingCount > 0 && (
                <span className="text-xs text-tb-primary font-bold mt-2 block bg-tb-primary/10 inline-block px-2 py-1 rounded-md">
                  +{upcomingCount - 1} more date{upcomingCount - 1 !== 1 ? 's' : ''} available
                </span>
              )}
            </div>
          </div>

          {earliestDeparture && (
            <div className="flex items-center gap-3 text-sm pt-4 border-t border-zinc-100">
              <Users className="w-5 h-5 text-zinc-400 shrink-0" />
              <div className="text-zinc-600 font-medium">
                <span className="font-bold text-red-600">{availableSeats} seats</span> left
              </div>
            </div>
          )}
        </div>

        <Link 
          href={`/treks/${pkg.slug}`}
          className="w-full inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tb-primary rounded-full bg-tb-primary text-white hover:bg-tb-primary-hover shadow-md h-12 px-6 text-base active:scale-95"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}
