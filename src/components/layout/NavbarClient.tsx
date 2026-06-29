"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from './Container';
import { Heart, Bell, User, LogOut, Compass, Settings, HelpCircle } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/providers/WishlistProvider';

interface NavbarClientProps {
  user: {
    id: string;
    email?: string;
    firstName: string;
  } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const { wishlistIds } = useWishlist();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  // Determine if this page should have a transparent navbar initially
  const isHeroPage = pathname === '/' || pathname?.startsWith('/master-treks/');
  const isSolid = !isHeroPage || scrolled;

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
    { name: 'Companies', href: '/companies' },
    { name: 'Explore', href: '/search' },
    { name: 'Treks', href: '/treks' },
    { name: 'Regions', href: '/regions' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${isSolid
            ? 'bg-white/95 backdrop-blur-md border-b border-tb-border shadow-tb-subtle py-2'
            : 'bg-transparent border-transparent py-4'
          }`}
      >
        <Container>
          <div className="flex h-12 md:h-14 items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${isSolid ? 'text-tb-text-primary' : 'text-white drop-shadow-md'
                  }`}
              >
                TrekBazaar.
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors duration-300 ${isSolid
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
              {user ? (
                <div className="flex items-center gap-5">
                  <Link href="/account/wishlist" className={`relative transition-colors hover:text-tb-primary ${isSolid ? 'text-zinc-600' : 'text-white'}`}>
                    <Heart className="w-5 h-5" />
                    {wishlistIds.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {wishlistIds.length}
                      </span>
                    )}
                  </Link>
                  <button className={`relative transition-colors hover:text-tb-primary ${isSolid ? 'text-zinc-600' : 'text-white'}`}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                      className="w-10 h-10 rounded-full bg-tb-primary text-white flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 transition-transform"
                    >
                      {user.firstName[0]?.toUpperCase()}
                    </button>

                    <AnimatePresence>
                      {isAvatarDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-tb-large border border-zinc-100 overflow-hidden"
                        >
                          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                            <div className="font-bold text-zinc-900">{user.firstName}</div>
                            <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                          </div>
                          <div className="py-2 flex flex-col">
                            <Link href="/account/trips" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-tb-primary transition-colors">
                              <Compass className="w-4 h-4" /> My Trips
                            </Link>
                            <Link href="/account/wishlist" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-tb-primary transition-colors">
                              <Heart className="w-4 h-4" /> Wishlist
                            </Link>
                            <Link href="/account/profile" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-tb-primary transition-colors">
                              <User className="w-4 h-4" /> Profile
                            </Link>
                            <Link href="/account/settings" onClick={() => setIsAvatarDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-tb-primary transition-colors">
                              <Settings className="w-4 h-4" /> Settings
                            </Link>
                          </div>
                          <div className="border-t border-zinc-100 py-2">
                            <Link href="/help" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                              <HelpCircle className="w-4 h-4" /> Help Center
                            </Link>
                            <form action={logoutAction} className="w-full">
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="w-4 h-4" /> Logout
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/partner"
                    className={`hidden lg:block text-sm font-bold transition-colors duration-300 mr-4 ${isSolid
                        ? 'text-tb-text-secondary hover:text-tb-primary'
                        : 'text-white/80 hover:text-white drop-shadow-sm'
                      }`}
                  >
                    Become a Partner
                  </Link>
                  <Link
                    href="/login"
                    className={`text-sm font-bold transition-colors duration-300 ${isSolid
                        ? 'text-tb-text-secondary hover:text-tb-primary'
                        : 'text-white/80 hover:text-white drop-shadow-sm'
                      }`}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className={`text-sm font-bold px-5 py-2 rounded-full transition-colors duration-300 shadow-sm ${isSolid
                        ? 'bg-tb-primary text-white hover:bg-tb-primary-hover'
                        : 'bg-white text-tb-primary hover:bg-zinc-100'
                      }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden flex items-center justify-center w-11 h-11 transition-colors duration-300 ${isSolid ? 'text-tb-text-primary hover:bg-zinc-100' : 'text-white hover:bg-white/10'
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

      </header>

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
              {user ? (
                <div className="pt-6 mt-6 border-t border-zinc-100 flex flex-col space-y-2">
                  <div className="flex items-center gap-3 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-tb-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.firstName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900">{user.firstName}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/account/trips" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors">
                    <Compass className="w-5 h-5" /> My Trips
                  </Link>
                  <Link href="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors">
                    <Heart className="w-5 h-5" /> Wishlist
                  </Link>
                  <Link href="/account/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <Link href="/account/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-zinc-700 py-3 hover:text-tb-primary transition-colors">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                  <div className="pt-4 mt-4 border-t border-zinc-100">
                    <form action={logoutAction}>
                      <button onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-red-600 py-3 w-full text-left hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="pt-6 mt-6 border-t border-zinc-100 flex flex-col space-y-2">
                  <Link
                    href="/partner"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-bold text-zinc-900 py-2 hover:text-tb-primary transition-colors"
                  >
                    Become a Partner
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-bold text-zinc-900 py-2 hover:text-tb-primary transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-bold text-tb-primary py-2 hover:text-tb-primary-hover transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
