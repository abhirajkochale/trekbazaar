import React from 'react';
import Link from 'next/link';
import { MapPin, Mountain, CalendarDays, ExternalLink, IndianRupee } from 'lucide-react';
import { PartnerBadge } from '@/components/ui/PartnerBadge';
import type { PublicCompany } from '@/lib/public/companies';

interface CompanyCardProps {
  company: PublicCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { metrics } = company;
  
  return (
    <Link href={`/company/${company.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
        {company.cover_image_url ? (
          <img 
            src={company.cover_image_url} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
            <Mountain className="w-12 h-12 text-zinc-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {metrics.badges.map(badge => (
            <PartnerBadge key={badge} type={badge} />
          ))}
        </div>
      </div>
      
      <div className="p-6 pt-0 relative flex-1 flex flex-col">
        {/* Logo */}
        <div className="absolute -top-10 right-6 w-20 h-20 bg-white rounded-2xl p-1.5 shadow-lg border border-zinc-100">
          <div className="w-full h-full bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-zinc-300">{company.name.charAt(0)}</span>
            )}
          </div>
        </div>
        
        <div className="mt-5 pr-20">
          <h3 className="text-xl font-black text-zinc-900 group-hover:text-tb-primary transition-colors line-clamp-1">
            {company.name}
          </h3>
          {(company.city || company.state) && (
            <div className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1.5">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{[company.city, company.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
        </div>
        
        <p className="mt-4 text-sm text-zinc-600 line-clamp-2 leading-relaxed flex-1">
          {company.description || "A trusted trekking operator verified by TrekBazaar."}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Treks</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Mountain className="w-4 h-4 text-tb-primary" />
              <span className="font-bold text-zinc-900">{metrics.activeTreksCount || 0}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Departures</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CalendarDays className="w-4 h-4 text-tb-secondary" />
              <span className="font-bold text-zinc-900">{metrics.upcomingDeparturesCount || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-6 pt-5 border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Starting from</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <IndianRupee className="w-4 h-4 text-zinc-900 mb-0.5" />
              <span className="text-lg font-black text-zinc-900">{metrics.lowestPrice?.toLocaleString() || "---"}</span>
            </div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-tb-primary group-hover:text-white text-zinc-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
