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
import type { Company } from '@/lib/types';

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

export function TrekEditor({ 
  initialTrek, 
  companies = [], 
  masterTreks = [],
  isCompanyPortal = false, 
  onSaveOverride 
}: { 
  initialTrek?: Trek, 
  companies?: Company[], 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  masterTreks?: any[],
  isCompanyPortal?: boolean, 
  onSaveOverride?: (payload: Partial<Trek>) => Promise<{success: boolean, error?: string, trekId?: string}> 
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Provide defaults for all fields to prevent controlled/uncontrolled warnings
  const [trek, setTrek] = useState<Partial<Trek>>(initialTrek || {
    company_id: null,
    master_trek_id: null,
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
    gallery: [],
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
    if (!trek.master_trek_id) {
      if (showToast) toast.error("Master Trek is required before saving.");
      return;
    }

    setIsSaving(true);
    const res = onSaveOverride 
      ? await onSaveOverride(trek)
      : await saveTrekAction(trek);
    setIsSaving(false);

    if (res.success) {
      setLastSaved(new Date());
      setIsDirty(false);
      if (showToast) toast.success("Saved successfully");
      
      // If it's a new trek, redirect to edit URL to preserve identity for future saves.
      // Stay within the correct portal (company vs admin).
      if (!initialTrek && res.trekId) {
        const basePath = isCompanyPortal ? "/partner/treks" : "/admin/treks";
        startTransition(() => {
          router.replace(`${basePath}/${res.trekId}/edit`);
        });
      }
    } else {
      if (showToast) toast.error(res.error || "Failed to save");
    }
  }, [trek, initialTrek, router, isCompanyPortal, onSaveOverride]);

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

  const [activeSection, setActiveSection] = useState('basic-info');

  // Real-time Sidebar Navigation (ScrollSpy)
  useEffect(() => {
    const sectionIds = ['basic-info', 'media-gallery', 'trek-details', 'itinerary', 'inclusions', 'faqs', 'seo'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by their vertical position to find the uppermost visible one
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px', // Trigger when a section reaches near the sticky header
        threshold: 0
      }
    );

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-500">
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-30 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200/80 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={isCompanyPortal ? "/partner/treks" : "/admin/treks"} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
                {initialTrek ? initialTrek.title || 'Untitled Trek' : 'Create New Trek'}
              </h1>
              <div className="text-xs font-medium flex items-center gap-2 mt-1">
                {isSaving ? (
                  <span className="text-tb-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tb-primary animate-pulse"></span> Saving...</span>
                ) : isDirty ? (
                  <span className="text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Unsaved changes</span>
                ) : lastSaved ? (
                  <span className="text-zinc-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span> Saved just now</span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span> Draft</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {initialTrek?.slug && (
              <Link 
                href={`/treks/${initialTrek.slug}`} 
                target="_blank"
                className="h-9 px-4 text-sm font-bold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </Link>
            )}
            
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="h-9 px-6 text-sm font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <nav className="sticky top-32 space-y-1">
            {[
              { id: 'basic-info', label: 'Overview' },
              { id: 'media-gallery', label: 'Media' },
              { id: 'trek-details', label: 'Trek Details' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'inclusions', label: 'Inclusions & Exclusions' },
              { id: 'faqs', label: 'FAQs' },
              { id: 'seo', label: 'SEO' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeSection === item.id 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <div id="basic-info" className="scroll-mt-32">
            <AdminCard title="Overview" description="Basic information about the trek.">
              <BasicInfoSection trek={trek} updateField={updateField} companies={companies} masterTreks={masterTreks} isCompanyPortal={isCompanyPortal} />
            </AdminCard>
          </div>
          
          <div id="media-gallery" className="scroll-mt-32">
            <AdminCard title="Media & Gallery" description="Manage cover image and gallery photos. Drag and drop is supported.">
              <MediaSection trek={trek} updateField={updateField} />
            </AdminCard>
          </div>

          <div id="trek-details" className="scroll-mt-32">
            <AdminCard title="Trek Details" description="Logistics, difficulty, and physical requirements.">
              <DetailsSection trek={trek} updateField={updateField} />
            </AdminCard>
          </div>

          <div id="itinerary" className="scroll-mt-32">
            <AdminCard title="Itinerary Builder" description="Day by day schedule.">
              <ItineraryBuilder trek={trek} updateField={updateField} />
            </AdminCard>
          </div>

          <div id="inclusions" className="scroll-mt-32 space-y-6">
            <AdminCard title="Inclusions & Exclusions" description="What is covered in the price and what is not.">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-3">Highlights</h4>
                  <DynamicListSection trek={trek} field="highlights" updateField={updateField} placeholder="e.g. Walk on a frozen river" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-3">What&apos;s Included</h4>
                    <DynamicListSection trek={trek} field="included" updateField={updateField} placeholder="e.g. All meals during trek" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-3">What&apos;s Excluded</h4>
                    <DynamicListSection trek={trek} field="excluded" updateField={updateField} placeholder="e.g. Travel insurance" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 mb-3">Things To Carry</h4>
                  <DynamicListSection trek={trek} field="things_to_carry" updateField={updateField} placeholder="e.g. Trekking shoes" />
                </div>
              </div>
            </AdminCard>
          </div>

          <div id="faqs" className="scroll-mt-32">
            <AdminCard title="FAQ Builder" description="Commonly asked questions.">
              <FAQBuilder trek={trek} updateField={updateField} />
            </AdminCard>
          </div>

          <div id="seo" className="scroll-mt-32">
            <AdminCard title="SEO Configuration" description="Optimize for search engines.">
              <SEOSection trek={trek} updateField={updateField} />
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
