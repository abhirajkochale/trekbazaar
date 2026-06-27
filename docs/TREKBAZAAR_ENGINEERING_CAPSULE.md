# TREKBAZAAR ENGINEERING CAPSULE (MASTER KNOWLEDGE TRANSFER)

## 1. Startup Vision
TrekBazaar is built from first principles as a **Trekking Marketplace**, analogous to BookMyShow, Booking.com, or Airbnb, but exclusively for trekking expeditions. 
It is **NOT** a website for a single trekking operator. 

**Target Customers:** 
1. **End-Users (Trekkers):** Seeking curated, verified, and easily bookable trekking experiences with transparent pricing and guaranteed departures.
2. **Companies (Trekking Operators):** Small to medium-sized trekking companies that lack the technical infrastructure to manage inventory, booking lifecycles, and online payments. TrekBazaar provides them with a robust "Partner Portal" to manage their business.

**Marketplace Philosophy:**
TrekBazaar bridges the gap between fragmented, low-tech local operators and modern digitally-native consumers. We handle the discovery, trust, payment, and support infrastructure, while operators handle the actual execution of the trek.

**Revenue Model:**
Commission-based model on every successful booking, potentially with featured-listing upcharges in the future.

**Long-Term Vision:**
To become the defacto operating system for the global trekking industry, standardizing how departures are scheduled, how safety is verified, and how inventory is distributed.

---

## 2. Product Principles
- **Marketplace First:** Every feature must be designed assuming N number of independent operators. Data isolation is paramount.
- **Inventory Belongs to Companies:** The platform does not own the treks. We only curate and distribute them.
- **Bookings Belong to Departures:** A Trek is just a catalog item. A Departure is the actual physical event. You book a Departure, not a Trek.
- **Simplicity Over Enterprise Complexity:** Avoid complex enterprise CRM features. Operators are often technically unsavvy. The Partner Portal must be dead simple.
- **Mobile-First & SEO-First:** Consumer discovery happens on mobile via Google search. Fast load times (Next.js Server Components) and semantic HTML are non-negotiable.
- **Server Components Preferred:** Maximize SEO and minimize client bundles by doing data fetching on the server.
- **Reuse Over Duplication:** The Admin Portal and Company Portal share >90% of their UI components to ensure consistency and reduce maintenance burden.
- **Performance First:** No heavy client-side state management (no Redux). Use URL search params for state to enable link-sharing and SSR.

---

## 3. Complete Feature Timeline
- **TB-001 to TB-005:** Initial project scaffolding, UI design system implementation, and static homepage creation.
- **TB-006 (Treks CMS):** Built the foundational Admin CMS for Treks with dynamic itinerary and FAQ builders.
- **TB-007 (Regions):** Implemented Regions as a taxonomy to categorize treks for SEO.
- **TB-008 (Public Website Architecture):** Built the dynamic public-facing `/treks`, `/regions`, and `/treks/[slug]` pages using Server Components.
- **TB-009 (Search Architecture):** Implemented the Omni-Search bar and the URL-driven `/search` page with extensive filtering (price, duration, difficulty, region).
- **TB-010 (Enquiry System):** Added a lead-generation fallback for treks without active departures.
- **TB-011 (Companies):** Shifted from "operator_name" strings to a fully relational `companies` table to support the marketplace pivot.
- **TB-012 (Departures CMS):** Created the `departures` table and Admin CMS to manage physical inventory batches tied to specific dates and capacities.
- **TB-013 (Marketplace Inventory Flow):** Executed a major database migration to assign all legacy "orphan" treks to a default internal company, solidifying the strict `Company -> Trek -> Departure` hierarchy.
- **TB-014 (Booking Engine):** Implemented the highly secure `bookings` table and the `create_booking` PostgreSQL RPC function with `FOR UPDATE` row-level locking to prevent overselling.
- **TB-015 (Company Portal):** Built the isolated Partner Portal using Supabase Auth, strict RLS scoping, and shared Admin UI components, allowing independent operators to manage their own inventory.

---

## 4. Current Folder Architecture
- `src/app/`: The Next.js App Router. Contains all page routes.
  - `(public)/`: The consumer-facing marketplace (Homepage, Search, Trek Details).
  - `admin/`: The internal Super-Admin dashboard. Uses custom JWT-less cookie auth.
  - `company/`: The Partner Portal. Uses Supabase Auth and RLS.
- `src/components/`: Reusable React components.
  - `ui/`: Dumb, atomic design system components (Buttons, Inputs).
  - `admin/`: Complex business logic components (TrekEditor, BookingsTable). Now heavily shared with the `company/` routes via the `isCompanyPortal` prop.
- `src/lib/`: Core business logic, types, formatters, and data-fetching helpers.
  - `admin/`: Admin data fetchers (bypasses RLS).
  - `company/`: Partner data fetchers (strictly scoped by RLS).
- `supabase/migrations/`: The absolute source of truth for the database schema.

---

## 5. Database Documentation

**`companies`**
- Represents an independent trekking operator.
- `id` (UUID PK), `name`, `slug` (Unique), `status`, `verification_status`.
- `owner_id` (UUID FK -> auth.users): The Supabase Auth user who can log into the Partner Portal.
- **RLS:** Public read (if active), Update allowed if `auth.uid() = owner_id`.

**`regions`**
- Categorization taxonomy.
- `id` (UUID PK), `name`, `slug`.

**`treks`**
- The catalog listing (the "brochure").
- `id` (UUID PK), `company_id` (FK -> companies), `title`, `slug`, `price_per_person` (display price), `itinerary` (JSONB).
- **RLS:** Public read (if active), ALL allowed if company's `owner_id = auth.uid()`.

**`departures`**
- The physical inventory unit. A specific batch going on a specific date.
- `id` (UUID PK), `trek_id` (FK -> treks), `departure_date`, `return_date`, `total_seats`, `booked_seats`, `base_price`, `status`.
- **RLS:** Public read (if active), ALL allowed by joining `treks -> companies` checking `owner_id`.

**`bookings`**
- The transactional record of a reservation.
- `id` (UUID PK), `departure_id` (FK), `trek_id` (FK), `company_id` (FK), `customer_email`, `travellers_count`, `total_amount`, `status`.
- Includes snapshot fields (`departure_price`) so historical bookings don't change if the departure price is updated later.
- **RLS:** Companies can SELECT/UPDATE their own bookings.

**`enquiries`**
- Lead generation for sold-out or draft treks.
- `id` (UUID PK), `trek_id` (FK), `customer details`.

**RPC Functions**
- `create_booking`: Crucial PostgreSQL function. Takes departure_id and travellers_count. Uses `SELECT ... FOR UPDATE` to lock the departure row, verifies capacity, calculates pricing SERVER-SIDE, inserts the booking, and updates `booked_seats` atomically.

---

## 6. Public Website Architecture
- **Server Components:** Almost entirely rendered on the server for maximum SEO.
- **URL-Based State:** The `/search` page uses `searchParams` for filtering. No `useState` for filters. This allows users to share links like `?region=kashmir&difficulty=hard`.
- **Booking Flow:** Users view a Trek page, select an active Departure from the Sticky Sidebar, and open the Booking Modal. If no departures exist, it falls back to an Enquiry form.

---

## 7. Admin Architecture
- Lives under `/admin`.
- Authenticated via a lightweight custom HMAC cookie (`SESSION_COOKIE`), completely independent of Supabase Auth.
- Has god-mode access via the Supabase `service_role` key (bypassing RLS).
- Uses Server Actions heavily for form submissions.

---

## 8. Booking Engine (CRITICAL)
- **Why Departures?** You cannot book a "Trek". A Trek is an idea. A Departure is a reality with a date and a finite capacity.
- **Server-Side Pricing:** The frontend NEVER dictates the price. The frontend simply asks for X seats on Departure Y. The `create_booking` RPC calculates `total_amount = X * departure.base_price`.
- **Concurrency (Race Conditions):** If two users try to book the last seat simultaneously, the `FOR UPDATE` lock inside the RPC forces them to process sequentially. The second user will receive an "insufficient capacity" error, preventing overselling.

---

## 9. Marketplace Architecture
`Company -> Treks -> Departures -> Bookings`
This strict hierarchy ensures that money and responsibility always flow to the correct business entity. The Company owns the Trek. The Trek defines the Departures. The Departures hold the Bookings.

---

## 10. Authentication
- **Admin:** Custom HMAC cookie (Simple, unbreakable without the secret, no DB hits).
- **Company:** Supabase Auth (Email/Password). Admins provision these accounts. Companies log in at `/company/login`. Middleware checks Supabase session tokens for `/company/*` routes.
- **Customers (Future):** Will likely use Supabase Auth (OAuth/OTP).

---

## 11. Design System
- **Aesthetic:** Modern, premium, vibrant, glassmorphic. (e.g., BookMyShow/Airbnb hybrid).
- **Typography:** Modern sans-serif (Inter/Outfit).
- **CSS:** TailwindCSS heavily utilized via `className` utility merging (`cn`).
- **Components:** Found in `src/components/ui/`. Built to be headless where possible but highly styled.

---

## 12. Reusable Components
- **`TrekEditor` & `DepartureEditor`:** Massive, complex forms originally built for Admin. They accept an `isCompanyPortal` boolean to dynamically hide sensitive fields (like the Company dropdown) and alter save behavior via `onSaveOverride`.
- **`BookingsTable`:** Used in both Admin and Company dashboards. Adapts to allow status updates via callback props.

---

## 13. Coding Standards
- **RSC Default:** Every page and component is a Server Component unless it absolutely requires `onClick` or `useState` (marked with `"use client"`).
- **No Client Fetching:** Avoid `useEffect` for data fetching. Fetch data in the Server Component and pass it down as props.
- **Server Actions:** All mutations (Create, Update, Delete) are handled via Next.js Server Actions.
- **Strict Typing:** All database models have explicit TypeScript interfaces in `src/lib/types.ts`.

---

## 14. Technical Decisions
- **Why URL State for Search?** SSR compatibility, SEO, and shareability.
- **Why RPC for Bookings?** Postgres handles concurrency locking infinitely better and safer than application-level JavaScript.
- **Why Supabase?** Provides instant Postgres, out-of-the-box Auth, and most importantly, RLS (Row Level Security), which is the holy grail for building multi-tenant marketplaces securely.

---

## 15. Completed Roadmap
- [x] TB-001: Initial Setup
- [x] TB-006: Treks CMS
- [x] TB-008: Public Trek Pages
- [x] TB-009: Search Engine
- [x] TB-012: Departures Engine
- [x] TB-013: Inventory Migration
- [x] TB-014: Booking Engine (RPC & Locks)
- [x] TB-015: Company Portal (Partner Dashboard)

---

## 16. Current State
- **Production Ready:** The core marketplace inventory loop (Company -> Trek -> Departure -> Booking) is complete, secure, and production-ready. 
- **Production Ready:** The Admin and Company portals are fully functional.
- **Pending:** Actual payment gateway integration (Razorpay/Stripe). Currently, bookings are created in a "Pending" state representing a reserved seat awaiting offline/manual payment.

---

## 17. Future Roadmap
- **TB-016 (Booking Lifecycle):** Integrate payment gateways and automated ticketing.
- **TB-017 (Customer Portal):** Allow end-users to log in, view their upcoming trips, and download tickets.
- **TB-018 (Reviews):** Verified reviews tied to completed bookings.
- **TB-019 (Analytics):** Advanced charting for companies (revenue over time, occupancy rates).
- **TB-020 (Notifications):** Email/SMS alerts for new bookings and departure changes.

---

## 18. Important Business Rules
1. **Never Trust Frontend Pricing:** All financial calculations happen in Postgres.
2. **No Overbooking:** The database enforces capacity.
3. **Data Isolation:** A company must NEVER see another company's data. This is enforced at the database level via RLS.
4. **Admin Supremacy:** The internal Admin can see and edit everything.
5. **No Self-Registration:** Companies cannot sign up on their own. They must be vetted and provisioned by an Admin.

---

## 19. Lessons Learned
- **Orphan Treks:** Initially, treks were built without companies. We had to execute a complex migration to assign them to an internal company. Always start with the top-level tenant in a marketplace.
- **RLS Complexity:** Implementing RLS required multiple iterations to ensure the public could still read active treks while companies could only update their own.
- **Component Duplication vs Reuse:** We initially planned separate pages for Company Treks, but realized refactoring the Admin `TrekEditor` saved thousands of lines of code and ensured bug fixes apply globally.

---

## 20. Handoff Notes (To Future AI)
Hello Claude (or future AI), 

Welcome to TrekBazaar. You are inheriting a highly structured, scalable, and secure Next.js App Router codebase. 

**CRITICAL INSTRUCTIONS FOR YOU:**
1. **DO NOT BREAK THE HIERARCHY:** `Company -> Trek -> Departure -> Booking`. This is the spine of the application.
2. **RESPECT RLS:** If you add a new table (e.g., `reviews`), you MUST add RLS policies ensuring companies can only interact with reviews tied to their treks.
3. **USE SERVER COMPONENTS:** Do not fall back to client-side data fetching unless you are building a highly interactive dashboard widget.
4. **REUSE UI:** Look inside `src/components/admin` before building new forms. Extend them with `isCompanyPortal` or similar props instead of duplicating them.
5. **THE RPC IS SACRED:** Do not touch `create_booking` in PostgreSQL unless you absolutely have to, and if you do, ensure you understand `FOR UPDATE` locking.

You have everything you need. Proceed with confidence. Build an incredible product.
