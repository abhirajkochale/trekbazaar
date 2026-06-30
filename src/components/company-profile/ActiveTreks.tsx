import React, { Suspense } from 'react';
import { Container } from '@/components/layout/Container';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { MobileFilterSheet } from '@/components/search/MobileFilterSheet';
import { ActiveFiltersChips } from '@/components/search/ActiveFiltersChips';
import { MasterTrekSearchCard } from '@/components/search/MasterTrekSearchCard';
import { SortDropdown } from '@/components/search/SortDropdown';
import { Map } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treks: any[];
  companyName: string;
}

export function ActiveTreks({ treks, companyName }: Props) {
  // If the company GENUINELY has zero treks (not just filtered to zero), 
  // we might want a different state. 
  // But wait, if they have zero treks overall vs zero treks from filters, how do we distinguish?
  // Let's just use a clean empty state.
  
  if (!treks) return null;

  return (
    <section className="py-16 bg-white border-t border-zinc-100" id="treks">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">Treks by {companyName}</h2>
            <p className="mt-3 text-lg text-zinc-500 font-medium">Browse and filter all itineraries operated by {companyName}.</p>
          </div>
          <div className="shrink-0">
            <SortDropdown />
          </div>
        </div>
      </Container>
      
      <div className="bg-zinc-50/50 border-t border-zinc-100 py-12">
        <Container>
          <Suspense fallback={<div className="h-12 w-full max-w-sm bg-zinc-100/50 rounded-full animate-pulse mb-4 md:hidden border border-zinc-100"></div>}>
            <MobileFilterSheet />
          </Suspense>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-64 shrink-0">
              <Suspense fallback={<div className="w-64 h-[600px] bg-zinc-100/50 rounded-3xl animate-pulse border border-zinc-100"></div>}>
                <FilterSidebar />
              </Suspense>
            </aside>
            
            <main className="flex-1 w-full min-w-0">
              <Suspense fallback={<div className="h-10 w-64 bg-zinc-100/50 rounded-full animate-pulse mb-6 border border-zinc-100"></div>}>
                <ActiveFiltersChips />
              </Suspense>
              
              {treks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {treks.map((trek) => (
                    <MasterTrekSearchCard key={trek.id} masterTrek={trek} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                    <Map className="w-4 h-4 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">No treks found</h3>
                  <p className="text-zinc-500 max-w-sm font-medium">
                    We couldn't find any treks matching your current filters. Try adjusting them.
                  </p>
                </div>
              )}
            </main>
          </div>
        </Container>
      </div>
    </section>
  );
}
