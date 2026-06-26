import React from 'react';
import { Container } from '../layout/Container';

interface SearchLayoutProps {
  children: React.ReactNode;
}

export function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="bg-tb-sys-background min-h-screen py-12">
      <Container>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content (ResultsGrid) */}
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
