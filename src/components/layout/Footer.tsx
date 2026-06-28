import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-tb-border bg-tb-surface pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-tb-text-primary mb-4 block">
              TrekBazaar.
            </Link>
            <p className="text-tb-text-secondary text-sm">
              India&apos;s marketplace for Himalayan trekking. 
              Connecting trekkers with verified operators to compare itineraries and book securely.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-tb-text-primary mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="#featured-treks" className="text-sm text-tb-text-secondary hover:text-tb-primary">All Treks</Link></li>
              <li><Link href="#featured-regions" className="text-sm text-tb-text-secondary hover:text-tb-primary">Regions</Link></li>
              <li><Link href="#why-choose-us" className="text-sm text-tb-text-secondary hover:text-tb-primary">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-tb-text-primary mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-tb-text-secondary hover:text-tb-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-tb-text-secondary hover:text-tb-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-tb-text-secondary hover:text-tb-primary">Cancellation Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-tb-text-primary mb-4">For Operators</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-tb-text-secondary hover:text-tb-primary">Join as an Operator</Link></li>
              <li><Link href="/admin/login" className="text-sm text-tb-text-secondary hover:text-tb-primary">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-tb-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-tb-text-tertiary">
            © {new Date().getFullYear()} TrekBazaar. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-tb-text-tertiary">Built for the Mountains.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
