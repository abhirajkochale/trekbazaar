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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

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
            className={`md:hidden flex items-center justify-center w-11 h-11 transition-colors duration-300 ${
              scrolled ? 'text-tb-text-primary hover:bg-zinc-100' : 'text-white hover:bg-white/10'
            } rounded-full`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu Side Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col transition-transform transform translate-x-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <span className="text-xl font-bold text-zinc-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors -mr-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col py-4 px-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 mt-6 border-t border-zinc-100">
                <Link 
                  href="/admin/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
