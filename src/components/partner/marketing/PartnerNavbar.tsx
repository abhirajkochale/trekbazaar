"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function PartnerNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '/partner' },
    { name: 'How It Works', href: '/partner/how-it-works' },
    { name: 'Pricing', href: '/partner/pricing' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-200 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-tb-primary rounded-lg flex items-center justify-center text-zinc-900 font-black text-lg transition-transform group-hover:scale-105">
                T
              </div>
              <span className={`font-black text-xl tracking-tight ${isScrolled ? 'text-zinc-900' : (pathname === '/partner' ? 'text-white' : 'text-zinc-900')}`}>
                TrekBazaar <span className="font-medium text-zinc-400">|</span> Partners
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const isDarkPage = !isScrolled && pathname === '/partner';
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive 
                      ? (isDarkPage ? 'text-tb-primary' : 'text-tb-primary')
                      : (isDarkPage ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900')
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/partner/login"
              className={`text-sm font-bold transition-colors ${isScrolled || pathname !== '/partner' ? 'text-zinc-900 hover:text-zinc-700' : 'text-white hover:text-zinc-200'}`}
            >
              Log in
            </Link>
            <Link href="/partner/register" className="inline-flex items-center justify-center bg-tb-primary text-white font-medium hover:bg-tb-primary-hover h-10 px-6 rounded-xl transition-all">
              List Your Company
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isScrolled || pathname !== '/partner' ? 'text-zinc-900' : 'text-white'}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 py-4 px-4 shadow-lg flex flex-col space-y-4">
          {navLinks.map(link => (
            <Link 
              key={link.name}
              href={link.href}
              className="text-lg font-bold text-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-zinc-100" />
          <Link href="/partner/login" className="text-lg font-bold text-zinc-600">Log in</Link>
          <Link href="/partner/register" className="inline-flex items-center justify-center bg-tb-primary text-white font-medium hover:bg-tb-primary-hover h-10 w-full rounded-xl transition-all">
            List Your Company
          </Link>
        </div>
      )}
    </nav>
  );
}
