"use client";

import { useMemo, useState } from "react";
import { TrekCard } from "@/components/trek/TrekCard";
import { difficultyLabel } from "@/lib/format";
import type { Difficulty, Trek } from "@/lib/types";

const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "difficult", "extreme"];

export function TrekBrowser({
  treks,
  regions,
}: {
  treks: Trek[];
  regions: string[];
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return treks.filter((t) => {
      if (region && t.region !== region) return false;
      if (difficulty && t.difficulty !== difficulty) return false;
      if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [treks, query, region, difficulty]);

  const activeFilterCount = (region ? 1 : 0) + (difficulty ? 1 : 0);
  const hasAnyFilter = activeFilterCount > 0 || query.trim() !== "";

  function resetFilters() {
    setQuery("");
    setRegion("");
    setDifficulty("");
  }

  const selectClasses =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div>
      {/* Search + filter controls */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        {/* Search (always visible) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treks by name or description…"
            aria-label="Search treks"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          {/* Mobile-only toggle for the filter panel */}
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 sm:hidden"
            aria-expanded={showFilters}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Region + difficulty: collapsible on mobile, inline on desktop */}
        <div
          className={`${
            showFilters ? "grid" : "hidden"
          } mt-3 grid-cols-1 gap-3 sm:mt-3 sm:grid sm:grid-cols-2`}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Region
            </span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={selectClasses}
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              Difficulty
            </span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={selectClasses}
            >
              <option value="">Any difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {difficultyLabel(d)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Result summary + reset */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {filtered.length} {filtered.length === 1 ? "trek" : "treks"}
          {hasAnyFilter ? " match your filters" : " available"}
        </p>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
          <p className="text-zinc-600">
            No treks match your filters. Try widening your search.
          </p>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm font-medium text-emerald-700 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>
      )}
    </div>
  );
}
