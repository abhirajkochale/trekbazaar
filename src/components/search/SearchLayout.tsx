import React from 'react';
import { Container } from '../layout/Container';
import { FilterSidebar } from './FilterSidebar';
import { MobileFilterSheet } from './MobileFilterSheet';

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="bg-tb-sys-background min-h-screen py-12">
      <Container>
        <MobileFilterSheet />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: FilterSidebar (Desktop only) */}
          <aside className="hidden md:block w-64 shrink-0">
            <FilterSidebar />
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
