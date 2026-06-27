"use client";

import React, { useState, useMemo } from 'react';
import { MarketplaceCard } from './MarketplaceCard';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function MarketplaceSection({ packages }: Props) {
  const [sort, setSort] = useState("featured-first");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique companies
  const companies = useMemo(() => {
    const map = new Map();
    packages.forEach(p => {
      if (p.companies?.id) {
        map.set(p.companies.id, p.companies.name);
      }
    });
    return Array.from(map.entries());
  }, [packages]);

  const filteredAndSorted = useMemo(() => {
    let result = [...packages];

    // Difficulty Filter
    if (difficultyFilter !== "all") {
      result = result.filter(p => p.difficulty === difficultyFilter);
    }

    // Company Filter
    if (companyFilter !== "all") {
      result = result.filter(p => p.companies?.id === companyFilter);
    }

    // Price Filter
    if (priceFilter !== "all") {
      result = result.filter(p => {
        const price = p.departures?.[0]?.offer_price || p.departures?.[0]?.base_price || p.price_per_person;
        if (priceFilter === "under-10k") return price < 10000;
        if (priceFilter === "10k-20k") return price >= 10000 && price <= 20000;
        if (priceFilter === "over-20k") return price > 20000;
        return true;
      });
    }

    // Duration Filter
    if (durationFilter !== "all") {
      result = result.filter(p => {
        if (durationFilter === "short") return p.duration_days < 5;
        if (durationFilter === "medium") return p.duration_days >= 5 && p.duration_days <= 8;
        if (durationFilter === "long") return p.duration_days > 8;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      const aPrice = a.departures?.[0]?.offer_price || a.departures?.[0]?.base_price || a.price_per_person;
      const bPrice = b.departures?.[0]?.offer_price || b.departures?.[0]?.base_price || b.price_per_person;
      
      if (sort === "lowest-price") return aPrice - bPrice;
      if (sort === "highest-price") return bPrice - aPrice;
      if (sort === "earliest-departure") {
        const aDate = a.departures?.[0]?.departure_date ? new Date(a.departures[0].departure_date).getTime() : Infinity;
        const bDate = b.departures?.[0]?.departure_date ? new Date(b.departures[0].departure_date).getTime() : Infinity;
        return aDate - bDate;
      }
      if (sort === "most-seats") {
        const aSeats = a.departures?.[0] ? a.departures[0].total_seats - a.departures[0].booked_seats : 0;
        const bSeats = b.departures?.[0] ? b.departures[0].total_seats - b.departures[0].booked_seats : 0;
        return bSeats - aSeats;
      }
      if (sort === "most-departures") {
        return (b.departures?.length || 0) - (a.departures?.length || 0);
      }
      if (sort === "featured-first") {
        const aFeatured = a.companies?.featured ? 1 : 0;
        const bFeatured = b.companies?.featured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        
        const aVerified = a.companies?.verification_status === "verified" ? 1 : 0;
        const bVerified = b.companies?.verification_status === "verified" ? 1 : 0;
        if (aVerified !== bVerified) return bVerified - aVerified;
      }
      if (sort === "verified-first") {
        const aVerified = a.companies?.verification_status === "verified" ? 1 : 0;
        const bVerified = b.companies?.verification_status === "verified" ? 1 : 0;
        if (aVerified !== bVerified) return bVerified - aVerified;
      }
      return 0; 
    });

    return result;
  }, [packages, sort, difficultyFilter, companyFilter, priceFilter, durationFilter]);

  if (packages.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-tb-border shadow-tb-subtle">
        <h3 className="text-xl font-bold text-tb-text-primary">No tracking packages available</h3>
        <p className="text-tb-text-secondary mt-2">No trekking companies are currently offering this trek.</p>
      </div>
    );
  }

  const filterContent = (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-tb-text-secondary">Sort By</label>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border-zinc-200 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary shadow-sm"
        >
          <option value="featured-first">Recommended</option>
          <option value="lowest-price">Lowest Price</option>
          <option value="highest-price">Highest Price</option>
          <option value="earliest-departure">Earliest Departure</option>
          <option value="most-seats">Most Available Seats</option>
          <option value="most-departures">Most Upcoming Departures</option>
          <option value="verified-first">Verified First</option>
        </select>
      </div>

      <hr className="border-zinc-100" />

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 text-tb-text-primary font-bold">
          <Filter className="w-4 h-4" />
          Filters
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-tb-text-secondary">Company</label>
          <select 
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full border-zinc-200 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary shadow-sm"
          >
            <option value="all">All Companies</option>
            {companies.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-tb-text-secondary">Difficulty</label>
          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full border-zinc-200 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary shadow-sm"
          >
            <option value="all">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="difficult">Difficult</option>
            <option value="extreme">Extreme</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-tb-text-secondary">Price Range</label>
          <select 
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full border-zinc-200 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary shadow-sm"
          >
            <option value="all">Any Price</option>
            <option value="under-10k">Under ₹10,000</option>
            <option value="10k-20k">₹10,000 - ₹20,000</option>
            <option value="over-20k">Over ₹20,000</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-tb-text-secondary">Duration</label>
          <select 
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="w-full border-zinc-200 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary shadow-sm"
          >
            <option value="all">Any Duration</option>
            <option value="short">Under 5 Days</option>
            <option value="medium">5 - 8 Days</option>
            <option value="long">Over 8 Days</option>
          </select>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full flex justify-between items-center mb-4">
        <span className="text-sm text-zinc-500">{filteredAndSorted.length} packages found</span>
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm active:scale-95 transition-transform"
        >
          <Filter className="w-4 h-4" /> Filters & Sort
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] max-w-[80vw] bg-white z-50 shadow-2xl p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Filters & Sort</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-zinc-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
              
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-8 bg-tb-primary text-white py-3 rounded-lg font-medium"
              >
                Show Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-[160px]">
          {filterContent}
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 w-full space-y-6">
        {filteredAndSorted.length > 0 && (
          <div className="hidden lg:block text-sm text-zinc-500 mb-2">
            Showing {filteredAndSorted.length} operator package{filteredAndSorted.length !== 1 && 's'}
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.map(pkg => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <MarketplaceCard pkg={pkg} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSorted.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-20 text-center bg-white rounded-2xl border border-zinc-200 shadow-sm"
          >
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No packages found</h3>
            <p className="text-zinc-500">Try adjusting your filters to see more results.</p>
            <button 
              onClick={() => {
                setDifficultyFilter("all");
                setCompanyFilter("all");
                setPriceFilter("all");
                setDurationFilter("all");
              }}
              className="mt-6 text-tb-primary font-medium hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
