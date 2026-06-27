import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function CheckoutHeader() {
  return (
    <header className="bg-white border-b border-tb-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-tb-primary tracking-tight">
          TrekBazaar
        </Link>
        
        <div className="flex items-center gap-2 text-sm text-tb-text-secondary font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">100% Secure Checkout</span>
        </div>
      </div>
    </header>
  );
}
