"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { MasterTrek, MasterTrekCategory, Region, Trek } from '@/lib/types';
import { saveMasterTrekAction } from '@/app/admin/(dashboard)/master-treks/actions';
import toast from 'react-hot-toast';
import { AdminCard } from '../../shared/AdminCard';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

import { BasicInfoSection } from './BasicInfoSection';
import { DetailsSection } from './DetailsSection';
import { MasterMediaSection } from './MasterMediaSection';

// Reuse existing components from TrekEditor
import { DynamicListSection } from '@/components/admin/treks/editor/DynamicListSection';
import { SEOSection } from '@/components/admin/treks/editor/SEOSection';

interface Props {
  initialMasterTrek?: MasterTrek;
  categories: MasterTrekCategory[];
  regions: Region[];
}

export function MasterTrekEditor({ initialMasterTrek, categories, regions }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [masterTrek, setMasterTrek] = useState<Partial<MasterTrek>>(initialMasterTrek || {
    name: "",
    slug: "",
    category_id: null,
    region_id: null,
    country: "India",
    state: "",
    difficulty: null,
    duration_min: null,
    duration_max: null,
    altitude: "",
    best_season: "",
    overview: "",
    cover_image: "",
    gallery: [],
    highlights: [],
    seo_title: "",
    seo_description: "",
    status: "draft",
  });

  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof MasterTrek>(field: K, value: MasterTrek[K]) => {
    setMasterTrek(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async (showToast = true) => {
    if (!masterTrek.name) {
      if (showToast) toast.error("Name is required before saving.");
      return;
    }

    setIsSaving(true);
    const res = await saveMasterTrekAction(masterTrek);
    setIsSaving(false);

    if (res.success) {
      setLastSaved(new Date());
      setIsDirty(false);
      if (showToast) toast.success("Saved successfully");
      
      if (!initialMasterTrek && res.masterTrekId) {
        startTransition(() => {
          router.replace(`/admin/master-treks/${res.masterTrekId}/edit`);
        });
      }
    } else {
      if (showToast) toast.error(res.error || "Failed to save");
    }
  }, [masterTrek, initialMasterTrek, router]);

  // Keyboard shortcut Ctrl+S
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-zinc-50/90 backdrop-blur-md py-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/master-treks" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {initialMasterTrek ? `Edit: ${initialMasterTrek.name}` : 'Create Master Trek'}
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
          {initialMasterTrek?.slug && (
            <Link 
              href={`/treks/${initialMasterTrek.slug}`} 
              target="_blank"
              className="px-3 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Link>
          )}
          
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
            <BasicInfoSection masterTrek={masterTrek} updateField={updateField} categories={categories} regions={regions} />
          </AdminCard>
          
          <AdminCard title="Media & Gallery">
            <MasterMediaSection masterTrek={masterTrek} updateField={updateField} />
          </AdminCard>

          <AdminCard title="SEO Configuration">
            {/* Reusing SEOSection from Trek CMS via Type Casting */}
            <SEOSection 
              trek={masterTrek as unknown as Partial<Trek>} 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              updateField={updateField as any} 
            />
          </AdminCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AdminCard title="Trek Details">
            <DetailsSection masterTrek={masterTrek} updateField={updateField} />
          </AdminCard>

          <AdminCard title="Highlights">
            {/* Reusing DynamicListSection from Trek CMS via Type Casting */}
            <DynamicListSection 
              trek={masterTrek as unknown as Partial<Trek>} 
              field="highlights" 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              updateField={updateField as any} 
              placeholder="e.g. Walk on a frozen river" 
            />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
