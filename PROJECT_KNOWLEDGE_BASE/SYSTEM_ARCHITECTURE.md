# System Architecture

## Overview
TrekBazaar is built on a modern Next.js 14+ (App Router) stack with a Supabase PostgreSQL backend. It utilizes React Server Components, Server Actions, and a highly optimized client-side interactivity layer. 

## Database Architecture
The database is the ultimate source of truth. We strictly use Postgres Row Level Security (RLS) and enforce state through enums and constraints.

### Core Tables
1. **`master_treks`**: TrekBazaar's proprietary catalog of treks (e.g., "Kedarkantha"). Contains SEO data, altitude, difficulty, region, and standardized itineraries. 
2. **`companies`**: The operators on the platform. Governed by the `onboarding_status_enum`. Contains core business details, bank information (encrypted at rest by Supabase if configured), and metadata.
3. **`partner_documents`**: Dedicated table for KYC files. Links to `companies`. Uses `document_type_enum` (PAN, GST, BANK_PROOF, etc.) and `document_status_enum` (PENDING, APPROVED, REJECTED).
4. **`partner_application_history`**: An audit log tracking every transition of a company's `onboarding_status`. Captures `previous_status`, `new_status`, `changed_by`, and `notes`.
5. **`departures`**: Specific instances of a master trek offered by a company (e.g., "Jan 15, Kedarkantha, ₹10,000").
6. **`users`** / **`profiles`**: Standard authentication and user profile management.

### The Status State Machine
The heart of the B2B marketplace is `onboarding_status_enum`:
`REGISTERED` -> `PROFILE_COMPLETED` -> `DUE_DILIGENCE` -> `TERMS_ACCEPTED` -> `KYC_COMPLETED` -> `READY_FOR_REVIEW` -> `UNDER_REVIEW` -> `APPROVED` (or `REJECTED` / `CHANGES_REQUESTED` / `SUSPENDED`).
*Rule*: A company is completely invisible to the public marketplace unless `onboarding_status = 'APPROVED'`.

### Views and RPCs
- **`v_search_master_treks`**: A materialized-style or dynamic view that aggregates `master_treks` with data from `departures` and `companies`. It strictly filters to join only `APPROVED` companies, ensuring that search results accurately reflect verified supply.
- **`rpc_search_master_treks_weighted`**: A Postgres function that powers the search engine. It weights results based on text matching, popularity, and operator quality.

## Folder Structure
- `/src/app/(public)`: All customer-facing routes (Homepage, Search, Compare, Microsites). heavily cached Server Components.
- `/src/app/partner`: The B2B Operator SaaS portal.
  - `/partner/onboarding`: The progressive-disclosure setup wizard.
  - `/partner/dashboard`: The post-approval management interface.
- `/src/app/admin`: The internal TrekBazaar team portal for governing the platform (Reviewing KYC, managing Master Treks).
- `/src/components`: Component library divided by domain (`public`, `admin`, `partner`, `shared`, `ui`).
- `/src/lib`: Core utilities.
  - `/lib/supabase`: Server, Client, and Admin client initializers.
  - `/lib/types.ts`: The central nervous system of TypeScript interfaces, mirroring the Postgres schema.

## Component Architecture
- We use a hybrid architecture. Pages are `Server Components` by default to fetch data securely directly from Supabase without exposing APIs.
- We aggressively use `<form action={serverAction}>` with `useTransition` and `useActionState` in client components for seamless, JS-enhanced forms.
- Reusable components (like `DocumentUploadCard`) are designed to be context-agnostic so they can be consumed by both the Partner UI (for uploading) and the Admin UI (for reviewing, using `readOnly` flags).

## Storage & Uploads
Files are uploaded directly to Supabase Storage via `uploadMedia` server actions. We never store raw base64 data in the DB; we strictly store secure public/signed URLs in tables like `partner_documents`.

## Authentication & RLS
We use `@supabase/ssr` for cookie-based auth in Next.js.
Row Level Security (RLS) is paramount:
- A user can only edit a `company` row if `auth.uid() == owner_id`.
- A user can only see/edit `partner_documents` where the `company_id` matches a company they own.
- Public users can only select `companies` where `onboarding_status = 'APPROVED'`.
Server Actions utilize the standard `createClient()` which inherently respects these RLS policies based on the session cookie. Admin overrides use `createAdminClient()` (Service Role Key) strictly for internal syncs or bypassing RLS during specific automated transitions.
