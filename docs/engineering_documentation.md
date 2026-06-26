# TrekBazaar Engineering Documentation

This document provides a comprehensive, read-only analysis of the TrekBazaar project architecture, folder structure, and technical state, intended to onboard a senior engineer efficiently.

---

## 1. Executive Summary
TrekBazaar is a marketplace web application designed to help users discover and inquire about Himalayan treks from various trusted operators. 

Currently, the application functions as a lightweight listing and lead-generation platform. It allows public users to browse, search, and filter active treks, and submit inquiries directly to operators.

- **Production Ready**: The core data models (treks, enquiries), Next.js App Router setup, custom admin authentication, server actions for mutations, and basic Supabase integration.
- **Prototype/Demo**: The system uses a single shared password for admin access rather than full role-based access control. Operator data is currently denormalized (stored as plain text fields on the trek record).
- **Missing**: Real user accounts, dedicated operator dashboards, payment processing, booking management, and rich media galleries for treks.

---

## 2. Application Architecture
The project is built on **Next.js 16 (App Router)** utilizing React Server Components (RSC) and Turbopack.

- **Routing**: File-system based routing via `src/app`.
- **Components**: Strict separation between Server Components (used for direct database fetching) and Client Components (used for interactivity, filtering, and forms).
- **Server Actions**: Used for secure form submissions (e.g., `saveTrek`, `updateEnquiryStatus`, `login`, `logout`) to keep secrets on the server and avoid building traditional API routes.
- **Database (Supabase)**: PostgreSQL database with two primary tables: `treks` and `enquiries`.
- **Data Flow & Security (RLS)**: 
  - Public pages fetch data using the anonymous client. Row Level Security (RLS) ensures the public can only `SELECT` active treks and `INSERT` new enquiries (but not read them).
  - Admin pages and Server Actions use a `service_role` client to completely bypass RLS and perform administrative CRUD operations.
- **Authentication**: A custom, lightweight single-password authentication system for the admin panel. Supabase Auth is **not** used. The app uses `ADMIN_PASSWORD` to sign a JWT-like HMAC token stored in a secure cookie (`tb_admin_session`). `middleware.ts` protects all `/admin/*` routes.

---

## 3. Folder Walkthrough

- **`src/app/`**: Next.js App Router root.
  - `admin/`: Contains the admin dashboard. Protected by `middleware.ts`.
    - `(dashboard)/`: Route group for authenticated admin pages (treks list, enquiries list, create/edit forms).
    - `login/`: Public admin login page.
  - `search/`: Contains an incomplete placeholder page.
  - `treks/`: Dynamic routing (`[slug]`) for public trek detail pages.
  - `supabase-test/`: Test directory likely left over from initial scaffolding.
- **`src/components/`**: Reusable UI components.
  - `CoverImage.tsx`: UI helper for rendering images.
  - `EnquiryForm.tsx`: Client component for submitting lead forms (general or trek-specific).
  - `TrekBrowser.tsx`: Client component handling client-side search and filtering of the trek list.
  - `TrekCard.tsx`: Display card for a single trek listing.
- **`src/lib/`**: Utilities and core logic.
  - `auth.ts`: Custom HMAC-based admin authentication logic.
  - `format.ts`: Formatting helpers for currency, duration, slugs, and difficulty badges.
  - `treks.ts`: Shared server-side data fetching functions, wrapped in React `cache()` to deduplicate queries.
  - `types.ts`: Shared TypeScript interfaces.
  - `supabase/`: Supabase client initializers for different contexts (`client.ts`, `server.ts`, `admin.ts`, `middleware.ts`).
- **`supabase/migrations/`**: SQL schema definitions defining tables, indexes, triggers (e.g., `updated_at`), and RLS policies.

---

## 4. Route Inventory

| Route | Purpose | Implementation | Prod-Ready? | Issues/Notes |
|-------|---------|----------------|-------------|--------------|
| `/` | Home page | Fetches active treks, renders `TrekBrowser` and general `EnquiryForm`. | Yes | None |
| `/treks/[slug]` | Trek details | Fetches trek by slug. Renders details and specific `EnquiryForm`. | Yes | Uses `cache()` to share data with `generateMetadata`. |
| `/admin/login` | Admin auth | Client form triggering `login` Server Action. | Yes | Uses custom HMAC token. |
| `/admin` | Admin dashboard | Lists all treks (including drafts). Bypasses RLS. | Yes | None |
| `/admin/enquiries` | Enquiries list | Lists user inquiries. Allows changing status via Server Actions. | Yes | None |
| `/admin/treks/new` | Create trek | Admin form using `TrekForm` component. | Yes | None |
| `/admin/treks/[id]/edit` | Edit trek | Fetches trek by ID, populates `TrekForm`. | Yes | None |
| `/search` | Search placeholder| Empty/placeholder file (`page.tsx`). | No | Missing implementation. |

---

## 5. Component Inventory

- **`TrekBrowser`** (Client): Renders search bar, region/difficulty dropdowns, and a grid of `TrekCard`s. Handles all filtering purely on the client side using `useMemo`.
- **`EnquiryForm`** (Client): Handles form state, validation, and direct Supabase insertion using the anon client. Reused on both the homepage and the trek detail page.
- **`TrekCard`** (Server/Static): Simple, stateless component rendering a trek summary for the browser grid.
- **`TrekForm`** (Client): Admin form for creating/editing treks. Contains extensive form state and calls the `saveTrek` Server Action. Handles slug auto-generation.

---

## 6. Database & Backend

### Tables & Relationships
1. **`treks`**: 
   - Fields: `id`, `title`, `slug`, `description`, `region`, `difficulty`, `duration_days`, `price_per_person`, `cover_image_url`, `operator_name`, `operator_contact`, `status`.
   - Indexes on `region`, `difficulty`, `status`. 
2. **`enquiries`**: 
   - Fields: `id`, `trek_id` (FK to `treks.id`), `name`, `email`, `phone`, `message`, `status`.
   - Indexes on `trek_id`, `status`.

### Security (RLS)
- **`treks`**: Public can `SELECT` where `status = 'active'`.
- **`enquiries`**: Public can `INSERT` (with check true), but cannot `SELECT`, `UPDATE`, or `DELETE`.

### Data Fetching & Mutations
- **Public Fetching**: Done in Server Components using `src/lib/treks.ts`, using the standard Supabase server client.
- **Public Mutations**: `EnquiryForm` inserts directly to Supabase from the client browser.
- **Admin Fetching & Mutations**: Admin pages and Server Actions (`actions.ts`) use `createAdminClient()` (`service_role` key) to bypass RLS entirely.

---

## 7. User Flows

1. **Public Discovery Flow**: User lands on `/` &rarr; Views hero &rarr; Interacts with `TrekBrowser` to filter by region/difficulty &rarr; Client state updates immediately.
2. **Trek Detail Flow**: User clicks a `TrekCard` &rarr; Navigates to `/treks/[slug]` &rarr; Server fetches data &rarr; User reads details and views operator info.
3. **Enquiry Flow**: User fills out `EnquiryForm` on a trek page &rarr; Submits &rarr; Client-side validation &rarr; Supabase Anon Client inserts into `enquiries` table &rarr; Success state rendered.
4. **Admin Auth Flow**: Admin navigates to `/admin` &rarr; Middleware intercepts & redirects to `/admin/login` &rarr; Admin submits password &rarr; Server Action verifies & sets HMAC cookie &rarr; Redirects to `/admin`.
5. **Trek Management Flow**: Admin clicks "Add New Trek" &rarr; Fills `TrekForm` &rarr; Submits &rarr; Server Action `saveTrek` executes using `service_role` client &rarr; Revalidates Next.js cache (`/`, `/admin`, `/treks/[slug]`) &rarr; Redirects to `/admin`.

---

## 8. Current Project Status

- **Production Ready**: Core schema, public listings, detail pages, lead capture (enquiries), admin CRUD operations, custom admin authentication.
- **Needs Work**: Image management (currently relies on external URL inputs instead of a file upload system).
- **Prototype / Demo**: Single-password admin architecture.
- **Missing Features**:
  - Search page (`/search` exists but is empty).
  - Relational Operator entities (currently denormalized into `treks` table).
  - Payments, bookings, and user accounts.

---

## 9. Technical Debt Inventory

*Note: This section identifies debt without prescribing solutions.*

- **Hardcoded Values**: `SESSION_DURATION_MS` is hardcoded to 8 hours. `DIFFICULTIES` array is duplicated in `TrekBrowser.tsx` and `TrekForm.tsx`.
- **Duplicate Logic**: `statusBadge` UI styling logic is duplicated/re-implemented across `admin/(dashboard)/page.tsx` and `admin/(dashboard)/enquiries/page.tsx`.
- **Denormalized Data**: `operator_name` and `operator_contact` are flat text fields on the `treks` table, preventing scaling to a multi-tenant operator dashboard.
- **Unused/Dead Code**: `src/app/search` and `src/app/supabase-test` appear to be unused scaffolding or test directories.
- **Scalability of Auth**: The custom HMAC token auth with a single environment variable (`ADMIN_PASSWORD`) will not support multiple distinct admin or operator accounts.

---

## 10. Final Assessment

TrekBazaar is functionally sound for its Phase 1 objective: a public catalog and lead-generation tool. The architecture makes excellent use of Next.js 16 features, leaning heavily on Server Components for read operations, Client Components for filtering/forms, and Server Actions for protected mutations. The custom auth implementation is clever and lightweight but represents the most significant architectural bottleneck for future expansion. A new engineer can safely build upon the UI and Server Actions without untangling complex state management, as state is kept extremely localized and simple.
