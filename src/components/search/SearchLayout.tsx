import React, { Suspense } from 'react';
import { Container } from '../layout/Container';
import { FilterSidebar } from './FilterSidebar';
import { MobileFilterSheet } from './MobileFilterSheet';

interface SearchLayoutProps {
  children: React.ReactNode;
}

function SidebarFallback() {
  return <div className="w-64 h-[600px] bg-zinc-100 rounded-2xl animate-pulse"></div>;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="bg-tb-sys-background min-h-screen py-12">
      <Container>
        <Suspense fallback={<div className="h-10 w-32 bg-zinc-100 rounded-lg animate-pulse mb-4 md:hidden"></div>}>
          <MobileFilterSheet />
        </Suspense>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: FilterSidebar (Desktop only) */}
          <aside className="hidden md:block w-64 shrink-0">
            <Suspense fallback={<SidebarFallback />}>
              <FilterSidebar />
            </Suspense>
          </aside>
          
          {/* Main Content (ResultsGrid) */}
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
