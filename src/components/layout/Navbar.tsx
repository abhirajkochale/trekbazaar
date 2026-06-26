"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore Treks', href: '#featured-treks' },
    { name: 'Regions', href: '#featured-regions' },
    { name: 'About', href: '#why-choose-us' },
  ];

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-tb-border shadow-tb-subtle py-2' 
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <Container>
        <div className="flex h-12 md:h-14 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link 
              href="/" 
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-tb-text-primary' : 'text-white drop-shadow-md'
              }`}
            >
              TrekBazaar.
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    scrolled 
                      ? 'text-tb-text-secondary hover:text-tb-primary' 
                      : 'text-white/80 hover:text-white drop-shadow-sm'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/admin/login"
              className={`text-sm font-medium transition-colors duration-300 ${
                scrolled 
                  ? 'text-tb-text-secondary hover:text-tb-primary' 
                  : 'text-white/80 hover:text-white drop-shadow-sm'
              }`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            className={`md:hidden p-2 -mr-2 transition-colors duration-300 ${
              scrolled ? 'text-tb-text-primary' : 'text-white'
            }`}
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
        <div className="md:hidden border-t border-tb-border bg-white shadow-tb-medium absolute top-full left-0 w-full">
          <Container className="py-6 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-lg font-medium text-tb-text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-tb-border">
              <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="block text-lg font-medium text-tb-text-primary">Admin Login</span>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
