import React from 'react';
import { getCompany } from '@/lib/admin/companies';
import { notFound } from 'next/navigation';
import { ShieldCheck, XCircle, Clock, AlertCircle, Building2, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { ApplicationActions } from './ApplicationActions';

export const dynamic = "force-dynamic";

export default async function PartnerApplicationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompany(id);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Partner Application</h1>
          <p className="text-sm text-zinc-500 mt-1">Review and manage this trekking company's application.</p>
        </div>
        <ApplicationActions companyId={company.id} initialStatus={company.onboarding_status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-start gap-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center flex-shrink-0">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{company.name}</h2>
                <div className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {company.city || "No City"}, {company.state || "No State"}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700">
                  Status: {company.onboarding_status}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Company Description</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {company.description || "No description provided."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">GST Number</div>
                  <div className="font-semibold text-zinc-900">{company.gst_number || "Not provided"}</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience</div>
                  <div className="font-semibold text-zinc-900">{company.years_of_experience || 0} Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 border-b border-zinc-100 pb-2">Primary Contact</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-zinc-500">Contact Person</div>
                <div className="font-semibold text-zinc-900">{company.contact_person || "Not provided"}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" />
                <a href={`mailto:${company.email}`} className="text-sm font-semibold text-tb-primary hover:underline">{company.email || "No Email"}</a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-400" />
                <a href={`tel:${company.phone}`} className="text-sm font-semibold text-tb-primary hover:underline">{company.phone || "No Phone"}</a>
              </div>
              
              {company.website && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-tb-primary hover:underline">Website</a>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
