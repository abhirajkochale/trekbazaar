"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/types';
import { saveCompanyAction } from '@/app/admin/(dashboard)/companies/actions';
import toast from 'react-hot-toast';
import { AdminCard } from '../../shared/AdminCard';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { BasicInfoSection } from './BasicInfoSection';
import { ContactSection } from './ContactSection';
import { SocialSection } from './SocialSection';
import { VerificationSection } from './VerificationSection';
import { CredentialsSection } from './CredentialsSection';

export function CompanyEditor({ 
  initialCompany,
  isCompanyPortal = false,
  onSaveOverride
}: { 
  initialCompany?: Company,
  isCompanyPortal?: boolean,
  onSaveOverride?: (payload: Partial<Company>) => Promise<{success: boolean, error?: string, companyId?: string}>
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [company, setCompany] = useState<Partial<Company>>(initialCompany || {
    name: "",
    slug: "",
    logo_url: "",
    cover_image_url: "",
    description: "",
    contact_person: "",
    email: "",
    phone: "",
    emergency_contact: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    address: "",
    city: "",
    state: "",
    gst_number: "",
    years_of_experience: 0,
    gst_document_url: "",
    pan_document_url: "",
    registration_document_url: "",
    verification_status: "pending",
    status: "active",
    featured: false,
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof Company>(field: K, value: Company[K]) => {
    setCompany(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async (showToast = true) => {
    if (!company.name || !company.slug) {
      if (showToast) toast.error("Name and Slug are required.");
      return;
    }

    setIsSaving(true);
    const res = onSaveOverride 
      ? await onSaveOverride(company)
      : await saveCompanyAction(company);
    setIsSaving(false);

    if (res.success) {
      setLastSaved(new Date());
      setIsDirty(false);
      if (showToast) toast.success("Company saved successfully");
      
      if (!initialCompany && res.companyId) {
        startTransition(() => {
          router.replace(`/admin/companies/${res.companyId}/edit`);
        });
      }
    } else {
      if (showToast) toast.error(res.error || "Failed to save company");
    }
  }, [company, initialCompany, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setInterval(() => handleSave(false), 30000);
    return () => clearInterval(timer);
  }, [isDirty, handleSave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-zinc-50/90 backdrop-blur-md py-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {!isCompanyPortal && (
            <Link href="/admin/companies" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-200">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {isCompanyPortal 
                ? 'Company Profile' 
                : (initialCompany ? `Edit Company: ${initialCompany.name}` : 'Register New Company')
              }
            </h1>
            <div className="text-xs font-medium flex items-center gap-2 mt-0.5">
              {isSaving ? (
                <span className="text-tb-primary">Saving...</span>
              ) : isDirty ? (
                <span className="text-amber-600">Unsaved changes</span>
              ) : lastSaved ? (
                <span className="text-zinc-500">Last saved at {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span className="text-zinc-500">Draft</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-tb-primary rounded-lg hover:bg-tb-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Basic Information">
            <BasicInfoSection company={company} updateField={updateField} />
          </AdminCard>
          
          <AdminCard title="Contact Information">
            <ContactSection company={company} updateField={updateField} />
          </AdminCard>

          <AdminCard title="Social Links">
            <SocialSection company={company} updateField={updateField} />
          </AdminCard>
        </div>

        {!isCompanyPortal && (
          <div className="lg:col-span-1 space-y-6">
            <AdminCard title="Status & Verification">
              <VerificationSection company={company} updateField={updateField} />
            </AdminCard>

            <AdminCard title="Partner Access">
              <CredentialsSection company={company} />
            </AdminCard>
          </div>
        )}
      </div>
    </div>
  );
}
