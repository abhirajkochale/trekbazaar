import React from 'react';
import { Container } from '../layout/Container';

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="bg-tb-sys-background min-h-screen py-8">
      <Container>
        {/* Mobile Filter Button Placeholder */}
        <div className="md:hidden mb-4">
          <button className="w-full py-2 bg-white border border-tb-border rounded-tb-md text-sm font-medium text-tb-text-primary shadow-tb-subtle" disabled>
            Filters (0)
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: FilterSidebar Placeholder */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white border border-tb-border rounded-tb-md p-4 min-h-[500px]">
              <p className="text-sm text-tb-text-tertiary text-center mt-10">FilterSidebar Placeholder</p>
            </div>
          </aside>

          {/* Right Column: Main Content (ResultsGrid) */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
