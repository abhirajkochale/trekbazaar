import React from 'react';
import { PartnerNavbar } from '@/components/partner/marketing/PartnerNavbar';
import { Footer } from '@/components/layout/Footer';

export default function PartnerMarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PartnerNavbar />
      <main className="flex-1 min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}
