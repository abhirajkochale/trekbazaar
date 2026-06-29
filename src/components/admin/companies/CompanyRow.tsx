"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useTransition } from 'react';
import type { Company } from '@/lib/types';
import { Edit2, Trash2, MoreHorizontal, Star, ShieldCheck, Clock, XCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { toggleCompanyFeaturedAction } from '@/app/admin/(dashboard)/companies/actions';
import toast from 'react-hot-toast';

const verificationBadge = {
  approved: { icon: ShieldCheck, class: "bg-emerald-50 text-emerald-700" },
  pending: { icon: Clock, class: "bg-amber-50 text-amber-700" },
  changes_requested: { icon: Clock, class: "bg-amber-50 text-amber-700" },
  rejected: { icon: XCircle, class: "bg-red-50 text-red-700" },
  suspended: { icon: XCircle, class: "bg-red-50 text-red-700" },
};

const statusBadge = {
  active: "bg-zinc-100 text-zinc-700",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

export function CompanyRow({ company }: { company: Company }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleFeatured = () => {
    startTransition(async () => {
      const res = await toggleCompanyFeaturedAction(company.id, company.featured);
      if (res.success) {
        toast.success(company.featured ? "Company un-featured." : "Company featured!");
      } else {
        toast.error(res.error || "Failed to update featured status.");
      }
    });
  };

  const VerBadge = verificationBadge[company.verification_status];

  return (
    <>
      <tr className="hover:bg-zinc-50 transition-colors group">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 relative border border-zinc-200 flex items-center justify-center">
              {company.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={company.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Building2 className="w-5 h-5 text-zinc-400" />
              )}
            </div>
            <div>
              <Link href={`/admin/companies/${company.id}/edit`} className="font-semibold text-zinc-900 hover:text-tb-primary hover:underline flex items-center gap-1.5">
                {company.name}
                {company.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
              </Link>
              <div className="text-xs text-zinc-500">{company.city || 'No Location'} {company.state && `, ${company.state}`}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-zinc-900">{company.contact_person || 'N/A'}</div>
          <div className="text-xs text-zinc-500">{company.email || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border border-transparent ${VerBadge.class}`}>
            <VerBadge.icon className="w-3.5 h-3.5" />
            {company.verification_status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize border ${statusBadge[company.status] || "bg-zinc-100 text-zinc-700"}`}>
            {company.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
          {new Date(company.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
          
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/admin/companies/${company.id}/edit`}
              className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            
            {/* Action Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
                className={`p-1.5 rounded-md transition-colors ${menuOpen ? 'text-zinc-900 bg-zinc-200' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleToggleFeatured}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    <Star className={`w-4 h-4 ${company.featured ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} /> 
                    {company.featured ? "Unfeature" : "Feature"} Company
                  </button>
                  <div className="h-px bg-zinc-200 my-1"></div>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>

      <DeleteCompanyDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        companyId={company.id}
        companyName={company.name}
      />
    </>
  );
}
