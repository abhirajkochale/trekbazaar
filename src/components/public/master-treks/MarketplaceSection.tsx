"use client";

import React, { useState, useMemo } from 'react';
import { MarketplaceCard } from './MarketplaceCard';
import { Filter, X, ArrowRightLeft, Check, Minus, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/format';

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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

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

        const aVerified = a.companies?.verification_status === "approved" ? 1 : 0;
        const bVerified = b.companies?.verification_status === "approved" ? 1 : 0;
        if (aVerified !== bVerified) return bVerified - aVerified;
      }
      if (sort === "verified-first") {
        const aVerified = a.companies?.verification_status === "approved" ? 1 : 0;
        const bVerified = b.companies?.verification_status === "approved" ? 1 : 0;
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
          className="w-full border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-tb-primary focus:border-tb-primary shadow-sm"
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
            className="w-full border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-tb-primary focus:border-tb-primary shadow-sm"
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
            className="w-full border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-tb-primary focus:border-tb-primary shadow-sm"
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
            className="w-full border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-tb-primary focus:border-tb-primary shadow-sm"
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
            className="w-full border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-tb-primary focus:border-tb-primary shadow-sm"
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

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const comparePackages = packages.filter(p => compareIds.includes(p.id));

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
                <h3 className="font-bold text-lg text-zinc-900">Filters & Sort</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-zinc-500">
                  <X className="w-4 h-4" />
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
                <MarketplaceCard 
                  pkg={pkg} 
                  isSelectedForCompare={compareIds.includes(pkg.id)}
                  onCompareToggle={toggleCompare}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center bg-white rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100/60 shadow-sm">
              <Filter className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">No packages found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setDifficultyFilter("all");
                setCompanyFilter("all");
                setPriceFilter("all");
                setDurationFilter("all");
              }}
              className="mt-6 text-tb-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Compare Floating Action Bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-40 border border-zinc-700/50"
          >
            <div className="font-medium text-sm">
              <span className="font-bold text-white">{compareIds.length}</span> / 3 selected
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCompareIds([])}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                disabled={compareIds.length < 2}
                className="flex items-center gap-2 bg-white text-zinc-900 px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" /> Compare Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCompareModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-tb-primary" /> Compare Packages
                </h2>
                <button onClick={() => setIsCompareModalOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="overflow-x-auto pb-4">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 text-left border-b border-zinc-100 bg-white sticky left-0 z-10 w-48 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Features</th>
                        {comparePackages.map(pkg => (
                          <th key={pkg.id} className="p-4 text-left border-b border-zinc-100 min-w-[200px]">
                            <div className="font-bold text-zinc-900 text-lg mb-1 truncate">{pkg.companies?.name}</div>
                            <div className="text-tb-primary font-black text-xl">
                              {formatPrice(pkg.departures?.[0]?.offer_price || pkg.departures?.[0]?.base_price || pkg.price_per_person)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-zinc-50">
                      <tr>
                        <td className="p-4 font-semibold text-zinc-600 bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Duration</td>
                        {comparePackages.map(pkg => (
                          <td key={pkg.id} className="p-4 text-zinc-900">{pkg.duration_days} Days</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-zinc-600 bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Rating</td>
                        {comparePackages.map(pkg => (
                          <td key={pkg.id} className="p-4 text-zinc-900 font-medium flex items-center gap-1">
                            <Star className="w-4 h-4 fill-zinc-400 text-zinc-400" /> 4.9
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-zinc-600 bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Cancellation</td>
                        {comparePackages.map(pkg => (
                          <td key={pkg.id} className="p-4 text-zinc-900">{pkg.cancellation_policy || 'Standard'}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-zinc-600 bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Meals Included</td>
                        {comparePackages.map(pkg => {
                          const hasMeals = (pkg.included || []).some((i: string) => i.toLowerCase().includes('meal') || i.toLowerCase().includes('food'));
                          return (
                            <td key={pkg.id} className="p-4">
                              {hasMeals ? <Check className="w-4 h-4 text-zinc-500" /> : <Minus className="w-4 h-4 text-zinc-300" />}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-zinc-600 bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Transport</td>
                        {comparePackages.map(pkg => {
                          const hasTransport = (pkg.included || []).some((i: string) => i.toLowerCase().includes('transport') || i.toLowerCase().includes('pickup'));
                          return (
                            <td key={pkg.id} className="p-4">
                              {hasTransport ? <Check className="w-4 h-4 text-zinc-500" /> : <Minus className="w-4 h-4 text-zinc-300" />}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
