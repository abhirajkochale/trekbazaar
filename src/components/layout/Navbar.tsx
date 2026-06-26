"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Explore Treks', href: '#featured-treks' },
    { name: 'Regions', href: '#featured-regions' },
    { name: 'About', href: '#why-choose-us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-tb-border bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-tb-text-primary">
              TrekBazaar.
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-tb-text-secondary hover:text-tb-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden p-2 -mr-2 text-tb-text-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-tb-border bg-white">
          <Container className="py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-base font-medium text-tb-text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-tb-border">
              <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="block text-base font-medium text-tb-text-primary">Admin Login</span>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
