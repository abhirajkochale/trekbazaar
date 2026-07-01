# Project Timeline

This timeline tracks the chronological evolution of TrekBazaar from concept to current state.

## Phase 0: The Conceptualization
- **The Pivot**: Recognized that standard aggregator models (white-labeling operators) destroy local operator margins and create low-quality, race-to-the-bottom pricing.
- **The Concept**: TrekBazaar born as a B2B2C marketplace. A "Stripe Atlas" for local trekking agencies, giving them premium SaaS tools, and a curated marketplace for consumers to discover them based on real trust signals.

## Phase 1: MVP Architecture & Search Engine
- **Database Setup**: Initialized Supabase. Created `master_treks`, `companies`, and `departures`.
- **The Master Trek Decision**: Decided that TrekBazaar owns the SEO pages (Master Treks), and operators only list dates/prices (Departures). 
- **Search V1 to V2 Pivot**: Rebuilt the search engine via `v_search_master_treks` to allow complex aggregations (lowest price, operator count) without massive client-side data fetching.
- **Design System Lock**: Established the "Aesthetic Authority" rule. Strict monochrome/zinc palette, massive whitespace, Inter font.

## Phase 2: The Enterprise B2B Engine
- **Milestone 1.1 (The Database Refactor)**: Realized the `companies` table was becoming bloated with document URLs and boolean flags. Executed a major migration (`20260701030000`) to create `onboarding_status_enum`, `partner_documents`, and `partner_application_history`.
- **Milestone 1 (Wizard Scaffolding)**: Built the progressive-disclosure router and sticky sidebar for `/partner/onboarding`. Implemented auto-saving Company Info form.
- **Milestone 2 (Due Diligence)**: Built the dynamic `DocumentUploadCard`. Integrated Supabase storage to handle PDFs/Images. Enforced mandatory KYC uploads.
- **Milestone 3 (Commercial & Banking)**: Implemented the legal scroll-to-accept digital signature. Built the strict Indian banking form (IFSC validation). Added a masked review-preview screen.

## Current Status (Today)
- The B2C Marketplace Discovery engine is stable and performant.
- The B2B Partner Onboarding wizard is 70% complete (Steps 1 through 5 are fully operational, secure, and auto-saving).
- **Next Action**: Integrating inventory creation (Trek/Departure) into the end of the wizard before handing off to Admin Review.
