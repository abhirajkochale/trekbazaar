import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import type { PublicCompany } from '@/lib/public/companies';
import { generateCompanyTrustSignals } from '@/lib/trust';

interface CompanyCardProps {
  company: PublicCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { metrics } = company;
  const isVerified = metrics.badges.includes('verified');
  const trustSignals = generateCompanyTrustSignals(company);
  
  return (
    <Link href={`/company/${company.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 transition-all duration-300 hover:border-zinc-300">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden border-b border-zinc-100">
        {company.cover_image_url ? (
          <img 
            src={company.cover_image_url} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
             <span className="text-zinc-300 font-medium">No cover image</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Logo & Name */}
        <div className="flex items-start gap-3 mb-3">
          {company.logo_url && (
            <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden shadow-sm">
               <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-zinc-900 transition-colors flex items-center gap-1.5 leading-tight line-clamp-1">
              {company.name}
              {isVerified && (
                 <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2} />
              )}
            </h3>
            <p className="text-[14px] text-zinc-500 line-clamp-1 mt-0.5">
              {[company.city, company.state].filter(Boolean).join(", ") || 'India'}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[14px] text-zinc-600 line-clamp-2 leading-snug mb-4">
          {company.description || "A trusted trekking operator verified by TrekBazaar."}
        </p>

        {/* Unified Metadata & Trust Signals */}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] text-zinc-500 font-medium">
          {trustSignals.filter(s => s.type !== 'verified' && s.type !== 'location').map((signal, idx, arr) => (
            <React.Fragment key={signal.id}>
              <span className={signal.type === 'experience' ? 'text-zinc-700' : ''}>{signal.label}</span>
              {idx < arr.length - 1 && <span>•</span>}
            </React.Fragment>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
           <span className="text-[14px] text-zinc-500">Starting from</span>
           <span className="text-[15px] font-semibold text-zinc-900">
             {metrics.lowestPrice ? `₹${metrics.lowestPrice.toLocaleString()}` : "Price on request"}
           </span>
        </div>
      </div>
    </Link>
  );
}
