"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Trek } from '@/lib/types';
import { saveTrekAction } from '@/app/admin/(dashboard)/treks/actions';
import toast from 'react-hot-toast';
import { AdminCard } from '../../shared/AdminCard';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { BasicInfoSection } from './BasicInfoSection';
import { DetailsSection } from './DetailsSection';
import { SEOSection } from './SEOSection';
import { DynamicListSection } from './DynamicListSection';

// Lazy load large sections
const MediaSection = dynamic(() => import('./MediaSection').then(m => m.MediaSection), { 
  loading: () => <div className="h-48 animate-pulse bg-zinc-100 rounded-xl" />
});
const ItineraryBuilder = dynamic(() => import('./ItineraryBuilder').then(m => m.ItineraryBuilder), {
  loading: () => <div className="h-64 animate-pulse bg-zinc-100 rounded-xl" />
});
const FAQBuilder = dynamic(() => import('./FAQBuilder').then(m => m.FAQBuilder), {
  loading: () => <div className="h-64 animate-pulse bg-zinc-100 rounded-xl" />
});

export function TrekEditor({ initialTrek }: { initialTrek?: Trek }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Provide defaults for all fields to prevent controlled/uncontrolled warnings
  const [trek, setTrek] = useState<Partial<Trek>>(initialTrek || {
    title: "",
    slug: "",
    status: "draft",
    region: "",
    difficulty: "moderate",
    duration_days: 1,
    price_per_person: 0,
    short_description: "",
    description: "",
    operator_name: "",
    operator_contact: "",
    cover_image_url: "",
    gallery_images: [],
    altitude: "",
    distance: "",
    base_camp: "",
    start_point: "",
    end_point: "",
    best_season: "",
    temperature: "",
    age_limit: "",
    fitness_level: "",
    included: [],
    excluded: [],
    things_to_carry: [],
    highlights: [],
    itinerary: [],
    faqs: [],
    seo_title: "",
    seo_description: "",
    canonical_url: ""
  });

  const [isDirty, setIsDirty] = useState(false);

  // Update field helper
  const updateField = useCallback(<K extends keyof Trek>(field: K, value: Trek[K]) => {
    setTrek(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Save logic
  const handleSave = useCallback(async (showToast = true) => {
    if (!trek.title) {
      if (showToast) toast.error("Title is required before saving.");
      return;
    }

    setIsSaving(true);
    const res = await saveTrekAction(trek);
    setIsSaving(false);

    if (res.success) {
      setLastSaved(new Date());
      setIsDirty(false);
      if (showToast) toast.success("Saved successfully");
      
      // If it's a new trek, redirect to edit URL to preserve identity for future saves
      if (!initialTrek && res.trekId) {
        startTransition(() => {
          router.replace(`/admin/treks/${res.trekId}/edit`);
        });
      }
    } else {
      if (showToast) toast.error(res.error || "Failed to save");
    }
  }, [trek, initialTrek, router]);

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

  // Autosave every 30 seconds if dirty
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setInterval(() => {
      handleSave(false); // Silent save
    }, 30000);

    return () => clearInterval(timer);
  }, [isDirty, handleSave]);

  // Unsaved changes warning on close
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
          <Link href="/admin/treks" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-full hover:bg-zinc-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              {initialTrek ? `Edit: ${initialTrek.title}` : 'Create New Trek'}
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
          {initialTrek?.slug && (
            <Link 
              href={`/treks/${initialTrek.slug}`} 
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

      {/* Editor Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Basic Information">
            <BasicInfoSection trek={trek} updateField={updateField} />
          </AdminCard>
          
          <AdminCard title="Media & Gallery">
            <MediaSection trek={trek} updateField={updateField} />
          </AdminCard>

          <AdminCard title="Itinerary Builder">
            <ItineraryBuilder trek={trek} updateField={updateField} />
          </AdminCard>

          <AdminCard title="FAQ Builder">
            <FAQBuilder trek={trek} updateField={updateField} />
          </AdminCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AdminCard title="Trek Details">
            <DetailsSection trek={trek} updateField={updateField} />
          </AdminCard>

          <AdminCard title="Highlights">
            <DynamicListSection trek={trek} field="highlights" updateField={updateField} placeholder="e.g. Walk on a frozen river" />
          </AdminCard>

          <AdminCard title="What's Included">
            <DynamicListSection trek={trek} field="included" updateField={updateField} placeholder="e.g. All meals during trek" />
          </AdminCard>

          <AdminCard title="What's Excluded">
            <DynamicListSection trek={trek} field="excluded" updateField={updateField} placeholder="e.g. Travel insurance" />
          </AdminCard>

          <AdminCard title="Things To Carry">
            <DynamicListSection trek={trek} field="things_to_carry" updateField={updateField} placeholder="e.g. Trekking shoes" />
          </AdminCard>

          <AdminCard title="SEO Configuration">
            <SEOSection trek={trek} updateField={updateField} />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
