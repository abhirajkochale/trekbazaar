import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-tb-border bg-tb-surface pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 mb-4 block">
              TrekBazaar.
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs">
              India's marketplace for Himalayan trekking. 
              Connecting trekkers with verified operators to compare itineraries and book securely.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-zinc-900 mb-4 text-sm">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">All Treks</Link></li>
              <li><Link href="/regions" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Destinations</Link></li>
              <li><Link href="/companies" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Compare Operators</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 mb-4 text-sm">For Companies</h3>
            <ul className="space-y-3">
              <li><Link href="/partner" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">List Your Company</Link></li>
              <li><Link href="/partner/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Partner Dashboard</Link></li>
              <li><Link href="/admin/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 mb-4 text-sm">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Trust & Safety</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 mb-4 text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 font-medium">
            © {new Date().getFullYear()} TrekBazaar. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <Link href="#" className="hover:text-zinc-900 transition-colors">X (Twitter)</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">LinkedIn</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
