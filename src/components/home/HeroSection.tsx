"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <Section spacing="lg" background="muted" className="relative overflow-hidden">
      <Container variant="content" className="relative z-10 text-center py-12 md:py-20">
        <h1 className="text-display mb-6 text-tb-text-primary">
          Find Your Next Himalayan Adventure
        </h1>
        <p className="text-body-lg text-tb-text-secondary mb-10 max-w-2xl mx-auto">
          Discover handpicked treks from verified local operators. Compare regions, 
          difficulty, and prices to find the perfect expedition.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 justify-center bg-white p-2 rounded-tb-md shadow-tb-medium border border-tb-border">
          <input 
            type="text" 
            placeholder="Search for a trek or region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-tb-text-primary placeholder:text-tb-text-tertiary text-base"
          />
          <Button type="submit" size="md" className="w-full sm:w-auto shrink-0">
            Search Treks
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-tb-text-secondary">
          <span>Popular:</span>
          <a href="#featured-regions" className="hover:text-tb-primary hover:underline">Uttarakhand</a>
          <a href="#featured-regions" className="hover:text-tb-primary hover:underline">Himachal</a>
          <a href="#featured-regions" className="hover:text-tb-primary hover:underline">Ladakh</a>
        </div>
      </Container>
    </Section>
  );
}
