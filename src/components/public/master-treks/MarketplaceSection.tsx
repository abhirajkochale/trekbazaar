"use client";

import React, { useState, useMemo } from 'react';
import { MarketplaceCard } from './MarketplaceCard';
import { Filter, ArrowUpDown } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  packages: any[];
}

export function MarketplaceSection({ packages }: Props) {
  const [sort, setSort] = useState("lowest-price");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredAndSorted = useMemo(() => {
    let result = [...packages];

    // Filter
    if (difficultyFilter !== "all") {
      result = result.filter(p => p.difficulty === difficultyFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "lowest-price") return a.price_per_person - b.price_per_person;
      if (sort === "highest-price") return b.price_per_person - a.price_per_person;
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
      return 0; // newest-package would just be default creation order, not fetched here though.
    });

    return result;
  }, [packages, sort, difficultyFilter]);

  if (packages.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-tb-border shadow-tb-subtle">
        <h3 className="text-xl font-bold text-tb-text-primary">No tracking packages available</h3>
        <p className="text-tb-text-secondary mt-2">No trekking companies are currently offering this trek.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-tb-border shadow-tb-subtle">
          <div className="flex items-center gap-2 mb-4 text-tb-text-primary font-bold">
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </div>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border-zinc-300 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary"
          >
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="earliest-departure">Earliest Departure</option>
            <option value="most-seats">Most Available Seats</option>
          </select>
        </div>

        <div className="bg-white p-5 rounded-xl border border-tb-border shadow-tb-subtle">
          <div className="flex items-center gap-2 mb-4 text-tb-text-primary font-bold">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-tb-text-secondary">Difficulty</label>
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full border-zinc-300 rounded-lg text-sm focus:ring-tb-primary focus:border-tb-primary"
            >
              <option value="all">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 space-y-4">
        {filteredAndSorted.map(pkg => (
          <MarketplaceCard key={pkg.id} pkg={pkg} />
        ))}
        {filteredAndSorted.length === 0 && (
          <div className="py-12 text-center text-tb-text-secondary">
            No packages match your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
