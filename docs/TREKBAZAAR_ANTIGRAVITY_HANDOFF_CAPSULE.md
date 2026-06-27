# TREKBAZAAR — ANTIGRAVITY HANDOFF CAPSULE

> Purpose: let Antigravity AI resume TrekBazaar with zero context loss, without reading the prior chat.
> Companion doc: `docs/TREKBAZAAR_ENGINEERING_CAPSULE.md` is **historical** context written before/during the Antigravity build phase. It over-claims "production ready" in places — trust THIS capsule and the actual repo over it.
> Last updated by: Claude Code hardening phase. Reflects repo state at commit `e8f0848`.

> ⚠️ **CORRECTION vs the brief that generated this file:** that brief assumed "TB-015.4 is the next pending ticket." That is **stale**. TB-015.4 (booking immutability) is **DONE** (commit `e8f0848`). The real next step is **TB-015.5 cleanup + a full end-to-end test + pushing to origin**, then TB-016. See §18–§19, §28.

---

## 1. Executive Summary

TrekBazaar is a **startup marketplace** for trekking — think BookMyShow / Airbnb / Booking.com, but for Himalayan treks. It is **not** a school project and **not** a single operator's website. Multiple trek companies list trek packages; trekkers discover, compare, enquire, and **book specific departures**.

Current reality:
- **Public website, Admin portal, Company portal, and the Booking engine are mostly built** (delivered in the earlier "Antigravity / tb-015 feature" phase).
- The most recent phase (**Claude Code**) was **hardening & security**, not new features: it fixed a critical departures RLS hole, hardened company trek creation, hardened company identity resolution, and enforced booking immutability.
- **It is NOT fully production-ready.** Open items remain (lint failures, an `/admin/bookings` rendering bug, a search filter bug, no verified end-to-end booking test, migrations possibly not applied to the live DB, nothing pushed to origin).
- **Next:** finish remaining hardening/cleanup (call it **TB-015.5**) and a full end-to-end test **before** starting the Master Trek architecture (**TB-016**).

Stack: **Next.js 16.2.9 (App Router, RSC-first)**, **React 19**, **TypeScript (strict)**, **Tailwind CSS v4**, **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`), `framer-motion`, `lucide-react`, `react-hot-toast`, `recharts`. Package manager: npm. Build: Turbopack.

---

## 2. Startup Vision

- TrekBazaar = **BookMyShow/Airbnb/Booking.com for trekking**.
- **Trekkers** compare operators and **book a departure** (a dated, finite-capacity event), not an abstract trek.
- **Trek companies** (small/mid-sized operators, often low-tech) manage their own inventory via a Partner Portal.
- **TrekBazaar Admin** controls marketplace quality (verifies companies, curates content).
- **Simplicity over enterprise CRM** — the Partner Portal must be dead simple.
- **Admin-led onboarding**, not public self-registration (companies are vetted and provisioned by Admin).
- Revenue model (future): commission per booking + featured listings. Payments are **not** built yet.

---

## 3. Current Marketplace Model

```
Company → Trek Package → Departure → Booking
```

- **Company** = a trek operator (`companies` table). Linked to a login via `companies.owner_id → auth.users.id`.
- **Trek** = a **company-specific package/listing** (`treks` table, `treks.company_id → companies.id`). The "brochure": itinerary, gallery, inclusions, price.
- **Departure** = a dated batch with seats + price (`departures` table, `departures.trek_id → treks.id`). The actual bookable unit.
- **Booking** = a customer reservation (`bookings` table, `bookings.departure_id → departures.id`).

Rules in effect today:
- Bookings belong to departures; departures belong to company treks; treks belong to companies.
- **Customers do NOT log in** — booking is a public action via a safe server action + RPC.
- New bookings start as **`Pending`** (reserved seat awaiting manual/offline follow-up; no payment gateway yet).

---

## 4. Future Marketplace Model (TB-016 — DOCUMENT ONLY, DO NOT BUILD YET)

```
Master Trek / Trek Route → Company Trek Package → Departure → Booking
```

Why: "Kedarkantha" may be offered by hundreds of operators. Search should show **Kedarkantha once**; the user then **compares operators**, opens **one company's package**, and **books that company's departure**.

- This is **TB-016**, already planned and accepted (see §20–§22).
- It must be **incremental and additive**. Do **not** rewrite the booking engine. Existing `treks` become company packages; a new `master_treks` (a.k.a. `trek_routes`) table is added with `treks.master_trek_id` (nullable FK). Departures and bookings are **unchanged**.

---

## 5. Public User Flow (target)

```
Homepage → Search/Explore → Filter (region, difficulty, duration, price)
→ Click "Kedarkantha Trek" → Kedarkantha Marketplace Page
→ See multiple companies → Compare (price, rating, dates, inclusions, pickup, seats)
→ Select a company → Company Package Page (itinerary, gallery, highlights, inclusions/exclusions, operator info)
→ Check that company's upcoming departures → Select departure date
→ Book Departure → Enter name, phone, email, traveller count
→ Booking request submitted → Booking reference generated → Company/TrekBazaar follows up
```

**Current vs future:**
- **Current:** `/search` queries the `treks` table → returns **company packages** (one card per package). The "marketplace page" / operator-comparison layer does **not** exist yet.
- **Future (TB-016):** `/search` returns **master treks**; `/treks/[masterTrekSlug]` is the comparison page; `/treks/[masterTrekSlug]/[packageSlug]` is the company package page (reusing today's detail components + booking modal).

---

## 6. Current Public Routes (verified from repo/build)

- `/` — homepage ([src/app/page.tsx](../src/app/page.tsx)); hero + sections, fetches active treks via `getActiveTreks`.
- `/search` — ([src/app/search/page.tsx](../src/app/search/page.tsx)); URL-param driven (`q, region, difficulty, duration, minPrice, maxPrice, sort, page`), calls `searchTreks` ([src/lib/search/api.ts](../src/lib/search/api.ts)). **Returns treks (packages), not master treks.**
- `/treks` — ([src/app/treks/page.tsx](../src/app/treks/page.tsx)); **`redirect('/search')`**.
- `/treks/[slug]` — ([src/app/treks/[slug]/page.tsx](../src/app/treks/[slug]/page.tsx)); loads a **company-specific package** via `getTrekBySlug` (+ its Upcoming/Full active departures + related treks). Renders `components/trek/details/*` (HeroGallery, TrekOverview, QuickFacts, Highlights, ItineraryTimeline, StickySidebar, RelatedTreks) and the booking modal.
- `/regions/[slug]` — ([src/app/regions/[slug]/page.tsx](../src/app/regions/[slug]/page.tsx)); region landing page.

---

## 7. Current Admin Routes (verified)

Under `src/app/admin/`. Route group `(dashboard)` holds protected pages; `/admin/login` is outside it.
- `/admin/login`, `/admin` (dashboard), `/admin/companies`, `/admin/companies/new`, `/admin/companies/[id]/edit`, `/admin/regions`, `/admin/treks`, `/admin/treks/new`, `/admin/treks/[id]/edit`, `/admin/departures`, `/admin/departures/new`, `/admin/departures/[id]/edit`, `/admin/bookings`, `/admin/enquiries`.

Admin role:
- Auth = **custom HMAC cookie** (`ADMIN_PASSWORD` env), independent of Supabase Auth. Gate in [src/middleware.ts](../src/middleware.ts); helper [src/lib/auth.ts](../src/lib/auth.ts); cookie name `tb_admin_session`, 8h expiry.
- Data access = **`service_role`** via `createAdminClient()` ([src/lib/supabase/admin.ts](../src/lib/supabase/admin.ts)) → **bypasses RLS** (god mode). `lib/admin/*` fetchers; `actions.ts` mutations.
- Admin creates companies, **provisions company users** (creates the Supabase auth user + links `owner_id`), manages all marketplace data.

---

## 8. Current Company Portal Routes (verified)

Under `src/app/company/`. **Single layout** at `src/app/company/layout.tsx` wraps both `/company/login` and the `(dashboard)` group (there is **no** `(dashboard)/layout.tsx`).
- `/company/login`, `/company` (dashboard), `/company/treks`, `/company/treks/new`, `/company/treks/[id]/edit`, `/company/departures`, `/company/departures/new`, `/company/departures/[id]/edit`, `/company/bookings`, `/company/enquiries`, `/company/profile`.

Company role:
- Auth = **Supabase Auth** (email/password). Gate in [src/middleware.ts](../src/middleware.ts) (`/company/*` requires a Supabase session; logged-in users are redirected away from `/company/login`).
- Data access = RLS-scoped anon/cookie client ([src/lib/supabase/server.ts](../src/lib/supabase/server.ts)) **plus** explicit `company_id` filters in `lib/company/*` (defense in depth).
- Sees/manages **only its own** treks, departures, bookings, enquiries, profile. Cannot access `/admin`, cannot see other companies.
- Identity resolved via `getCompanyContext()` / `getCompanyId()` in [src/lib/company/auth.ts](../src/lib/company/auth.ts) (see §15).

---

## 9. Current Database Tables

Migrations are the source of truth: `supabase/migrations/`. `set_updated_at()` trigger function created in the init migration and reused.

### companies — `20260627100000`, owner_id added `20260627160000`
- Operator entity. Cols: `id`, `name`, `slug` (UNIQUE), `owner_id` (FK→`auth.users`, **nullable**, **partial UNIQUE** where not null after `190000`), logo/cover/description, contact fields, social, address, `gst_number`, `years_of_experience`, document URLs, `verification_status` (`pending/verified/rejected`), `status` (`active/suspended`), `featured`, timestamps.
- **RLS:** public SELECT where `status='active'`; company UPDATE own (`owner_id = auth.uid()`); no anon INSERT/DELETE (admin via service_role).
- Caveat: `owner_id` intentionally nullable (admin may create company before provisioning its login).

### regions — `20260627000000`
- Taxonomy. Cols: `id`, `name`, `slug` (UNIQUE), description, hero image, best_season, altitude_range, weather, `nearby_attractions[]`, `safety_tips[]`, `things_to_know[]`, `status`, timestamps. **5 seeded** (Uttarakhand, Himachal Pradesh, Kashmir, Ladakh, Sikkim).
- **RLS:** public SELECT where `status='active'`; writes admin-only.
- Caveat: `treks.region` is a **text NAME string**, not a FK to `regions.id` — an existing denormalization mismatch. TB-016 should introduce `master_treks.region_id` FK properly.

### treks — init `20260626000000`, expanded `20260627052156`, `company_id` `100000`, operator nullable `180000`
- Company package. Cols include: `id`, `company_id` (FK→companies, nullable, SET NULL), `title`, `slug` (**globally UNIQUE**), `description`/`short_description`, `region` (text), `difficulty` (`easy/moderate/difficult/extreme`), `duration_days`, `price_per_person`, `cover_image_url`, `gallery_images[]`, many detail cols, `itinerary` jsonb, `faqs` jsonb, SEO cols, `operator_name`/`operator_contact` (**DEPRECATED, now nullable**), `status` (`draft/active/archived`), timestamps.
- **RLS:** public SELECT where `status='active'`; company ALL own (via `company_id`→`owner_id=auth.uid()`).
- Caveat: legacy treks were assigned to an internal company "TrekBazaar Internal" (`trekbazaar-internal`) in `20260627140000`.

### departures — `20260627110000`, constraints `120000`, RLS `150000` then fixed `170000`
- Bookable inventory unit. Cols: `id`, `trek_id` (FK→treks, **ON DELETE CASCADE**), `departure_date`, `return_date`, `base_price`, `offer_price`, `total_seats`, `booked_seats` (default 0), `pickup_location`, `notes`, `status` (`Upcoming/Full/Cancelled/Completed`), `is_active`, timestamps.
- **CHECK constraints** (`120000`): valid status, `return_date >= departure_date`, `total_seats > 0`, **`booked_seats BETWEEN 0 AND total_seats`** (overbooking backstop), `base_price > 0`, `offer_price <= base_price`.
- **RLS (after TB-015.1 `170000`):** public SELECT only where `is_active AND status IN ('Upcoming','Full')`; company ALL own (trek→company→owner). **The dangerous `FOR ALL USING(true)` policy was removed.**

### bookings — `20260627130000`, RLS `160000`, immutability trigger `200000`
- Reservation record. Cols: `id`, `booking_reference` (UNIQUE, server-generated `TB-000001`), `departure_id` (FK RESTRICT), `trek_id` (FK RESTRICT), `company_id` (FK SET NULL), `customer_name/email/phone`, `travellers_count` (CHECK > 0), snapshots `departure_date`/`departure_price`/`total_amount`, `status` (CHECK `Pending/Confirmed/Rejected/Cancelled/Completed`, default `Pending`), `notes`, timestamps.
- **RLS:** company SELECT own + UPDATE own; **no anon access; no INSERT policy** (insert only via the SECURITY DEFINER RPC); no DELETE.
- **Trigger (TB-015.4 `200000`):** `bookings_enforce_immutability` blocks company users from changing any column except `status` (+ trigger-maintained `updated_at`).

### enquiries — init `20260626000000`, RLS `160000`
- Lead capture. Cols: `id`, `trek_id` (FK SET NULL), `name`, `email`, `phone`, `message`, `status` (`open/responded/closed`), `created_at`.
- **RLS:** public INSERT (form works without login); company manage own (trek→company→owner).

**Key relationships:** `companies.owner_id→auth.users` · `treks.company_id→companies` · `departures.trek_id→treks` · `bookings.departure_id→departures` · `bookings.trek_id→treks` · `bookings.company_id→companies`.

---

## 10. Booking Engine (CRITICAL — do not casually change)

Public booking flow: Trek page → `StickySidebar` selects a departure → `BookingModal`/`BookingForm` ([src/components/booking/](../src/components/booking/)) → server action [createBookingAction](../src/app/actions/booking.ts) → `supabase.rpc('create_booking', …)` via the **service-role** client.

RPC `create_booking(p_departure_id, p_travellers, p_name, p_email, p_phone, p_notes)` ([20260627130000](../supabase/migrations/20260627130000_add_bookings.sql)) — `SECURITY DEFINER`, `plpgsql`:
1. `SELECT … FROM departures WHERE id = p_departure_id FOR UPDATE` — **row lock** prevents race/oversell.
2. Validates departure exists, not `Full/Cancelled/Completed`, and `is_active`.
3. Checks `p_travellers <= total_seats - booked_seats`, else raises.
4. **Server-side price:** `v_unit_price := COALESCE(offer_price, base_price)`; `total_amount = unit * travellers`.
5. **Server-side reference:** `TB-` + `lpad(nextval('booking_ref_seq'), 6, '0')`.
6. Inserts booking as **`Pending`** with **snapshots** of `departure_date` and `departure_price`; derives `company_id` from `treks.company_id`.
7. Atomically updates `departures.booked_seats` and flips `status → 'Full'` at capacity.

Guarantees: departure-based, atomic, locked, no overbooking (RPC check **plus** `chk_departures_seats`), server-side pricing & reference, snapshots. **This is the strongest part of the architecture.** The TB-015.4 immutability trigger is `BEFORE UPDATE` only and uses `auth.role()` gating, so it **does not** affect this INSERT/RPC.

---

## 11. Completed Feature Timeline (modules present in repo)

Public: Homepage, Search (URL filters + sorting), Trek details, Hero gallery, Itinerary timeline, Sticky sidebar, Quick facts/highlights, Enquiry flow, Region pages.
Admin: Dashboard (recharts), Regions CMS, Companies CMS + **auth provisioning**, Treks CMS (`TrekEditor` + sections + itinerary/FAQ builders), Departures CMS (`DepartureEditor`), Bookings (read-only list), Enquiries.
Company Portal: Dashboard, Treks (list/new/edit), Departures (list/new/edit), Bookings (list + status), Enquiries, Profile.
Engine/infra: Booking engine + `create_booking` RPC, RLS across all tables, database cleanup migration, shared editors reused via `isCompanyPortal`/`onSaveOverride`.
Hardening (Claude phase): departures RLS fix, company trek creation hardening, company identity resolution, booking immutability.

Reusable components to prefer (do NOT duplicate): `components/trek/details/*`, `components/booking/*`, `components/admin/treks/editor/*` (`TrekEditor`, `BasicInfoSection`, etc.), `components/admin/bookings/BookingsTable.tsx`, `components/admin/departures/editor/*`, `components/admin/companies/editor/*`, `components/ui/*`.

---

## 12. Claude Phase Summary

1. **Read-only audit** first. Findings: `npm run build` **passed**; `npx tsc --noEmit` failed **only** on stale `.next/types` (cleared by a fresh build); `npm run lint` **failed** on pre-existing issues; **critical departures RLS hole**; TB-015 (Company Portal) was already **~80% implemented**, needing **hardening, not greenfield**; Master Trek architecture needed **planning, not immediate build**.
2. Produced a **TB-016 architecture plan** (accepted; see §20).
3. Implemented hardening tickets **TB-015.1 → TB-015.4** (see §13–§15 and §19/done).

---

## 13. TB-015.1 — Departures RLS Security Fix ✅

- **Commit:** `83e4fb3` — `fix(security): restrict departures rls policies`.
- **Migration:** [supabase/migrations/20260627170000_fix_departures_rls_security.sql](../supabase/migrations/20260627170000_fix_departures_rls_security.sql).
- **Problem:** `150000` created `"Allow admins full access to departures" FOR ALL USING(true) WITH CHECK(true)` with **no role restriction** → public anon could read/insert/update/delete any departure (seats, prices, dates, status).
- **Fix:** dropped that policy; public SELECT restricted to `is_active AND status IN ('Upcoming','Full')`; company ALL scoped to ownership; admin via service_role (no permissive policy).
- **Access matrix:** anon → SELECT active Upcoming/Full only · owner company (authenticated) → full access to own · non-owner authenticated → public-level read only · service_role → full.
- **User said the TB-015.1 SQL was applied in Supabase.** Verify before assuming (see §26).

---

## 14. TB-015.2 — Company Trek Creation Hardening ✅

- **Commit:** `560763f` — `fix(company): harden trek creation ownership`.
- **Files/migration:** [20260627180000_fix_treks_legacy_operator_fields.sql](../supabase/migrations/20260627180000_fix_treks_legacy_operator_fields.sql), [src/lib/company/treks.ts](../src/lib/company/treks.ts), [src/lib/types.ts](../src/lib/types.ts), [src/components/admin/treks/editor/TrekEditor.tsx](../src/components/admin/treks/editor/TrekEditor.tsx).
- **Problem:** `treks.operator_name`/`operator_contact` were legacy **NOT NULL** (footgun); company creation stored empty operator data → public cards showed "TrekBazaar"; needed server-side `company_id` protection; a redirect bug sent company users to `/admin/...` after create.
- **Fix:** made legacy operator fields **nullable** (+ deprecated comments); in `saveCompanyTrek`, **force `company_id`** from the logged-in company, **ignore client `company_id`**, **auto-populate** `operator_name`/`operator_contact` from the company profile, **strip injected `id`** on create; fixed the create-redirect to respect `isCompanyPortal`; `Trek.operator_*` typed `string | null`.
- **Verify migration applied** before assuming (see §26).

---

## 15. TB-015.3 — Company Identity Resolution Hardening ✅

- **Commit:** `300a965` — `fix(company): harden company identity resolution`.
- **Files/migration:** [20260627190000_harden_company_owner_identity.sql](../supabase/migrations/20260627190000_harden_company_owner_identity.sql), [src/lib/company/auth.ts](../src/lib/company/auth.ts), [src/app/company/layout.tsx](../src/app/company/layout.tsx), [src/components/company/layout/CompanyNotLinked.tsx](../src/components/company/layout/CompanyNotLinked.tsx), [src/app/admin/(dashboard)/companies/auth-actions.ts](../src/app/admin/(dashboard)/companies/auth-actions.ts), [src/app/company/(dashboard)/page.tsx](../src/app/company/(dashboard)/page.tsx).
- **Problem:** `getCompanyId()` used `.single()`; it silently returned `null` for both 0 companies and >1 companies → ambiguous empty portal; no DB-level one-company-per-owner enforcement.
- **Fix:** new `getCompanyContext()` returns a discriminated union `unauthenticated | no-company | multiple-companies | ok` (fetches `.limit(2)` to detect duplicates deterministically; never leaks raw errors); `getCompanyId()` kept as a thin shim (back-compat). Layout gates: `unauthenticated`→bare page; non-ok→clean `CompanyNotLinked` screen (no redirect, avoids loop under the single layout); `ok`→portal. Migration adds **partial unique index** `companies_owner_id_unique ON companies(owner_id) WHERE owner_id IS NOT NULL`, with a duplicate-pre-check that fails loudly; `owner_id` stays nullable. Admin provisioning hardened: refuses if company already linked; detects `23505` on link → clear error + rollback.
- **Verify migration applied** before assuming (see §26).

---

## 16. Current Git State

- `git status -sb`: `## main...origin/main [ahead 4]` and one untracked file `docs/TREKBAZAAR_ENGINEERING_CAPSULE.md` (this capsule add will show as a second untracked file).
- `git log --oneline` (top): `e8f0848` (TB-015.4) → `300a965` (TB-015.3) → `560763f` (TB-015.2) → `83e4fb3` (TB-015.1) → `b40c04c feat(tb-015): add src/middleware.ts` → … (earlier `feat(tb-015): …` per-file commits from the Antigravity phase).
- **Local is ahead of `origin/main` by 4 commits** (all four TB-015.x). **Nothing has been pushed.**
- Commit author identity used in this phase: `Manaalshah1234 <manaal.shah@somaiya.edu>` (no AI co-author trailer).
- **Do NOT commit `docs/TREKBAZAAR_ENGINEERING_CAPSULE.md` or this capsule** unless explicitly asked. Stage only ticket-specific files.

---

## 17. Current Check Status (re-verify before trusting)

- `npm run build` → **passes** (exit 0). All ~31 routes compile.
- `npx tsc --noEmit` → **passes** (exit 0) **after a fresh build** regenerates `.next/types`. If you see a stale error about a deleted `supabase-test` page, run a build (or `rm -rf .next`) and re-run.
- `npm run lint` → **fails** (exit 1), **all pre-existing/unrelated**:
  - `scripts/check-db.js` — 2× `@typescript-eslint/no-require-imports`.
  - `scripts/test-anon.js` — 1× `no-require-imports`.
  - `src/components/admin/companies/editor/CompanyEditor.tsx` — `react-hooks/exhaustive-deps` (missing `onSaveOverride`).
  - `src/components/admin/departures/editor/DepartureEditor.tsx` — same hook-deps warning.
  - `src/lib/company/profile.ts:34` — `@typescript-eslint/ban-ts-comment` (`@ts-ignore` should be `@ts-expect-error`).
  - Total: **6 problems (4 errors, 2 warnings)** at `e8f0848`. (Note: Next 16 does NOT run ESLint during `next build`, so lint red does not block builds — but it violates the repo's own Git rule in `ENGINEERING_STANDARDS.md`.)

---

## 18. Known Risks / Gaps Still Pending

- **Migration application is UNCONFIRMED.** `npx supabase migration list` showed **only** `20260626000000` recorded as applied on the remote; everything from `20260627000000` onward (including TB-015.1–.4) showed an **empty remote column**. Either they were applied out-of-band via the Supabase dashboard SQL editor (CLI history out of sync) or they are genuinely unapplied. **Antigravity must verify actual DB state before assuming** (see §26).
- **Nothing pushed to origin** (local ahead by 4).
- **`/admin/bookings` renders static** (missing `export const dynamic = "force-dynamic"`) → admins may see stale/empty bookings. Peer admin pages have it; this one doesn't.
- **Search season filter bug:** [src/lib/search/api.ts](../src/lib/search/api.ts) filters `best_seasons` (plural array) but the column is `best_season` (singular text) → `?season=` errors/empties. Also text search is **title-only** (not description).
- **Lint failures** remain (§17).
- **Admin booking status updates are not wired** in the UI (admin bookings is read-only; `BookingsTable` supports `onStatusChange` but the admin page doesn't pass it). Company side IS wired.
- **No verified end-to-end test** of: Admin creates company → provisions login → company logs in → company creates trek → company creates departure → public books departure → booking shows in admin + company → seat count decrements → status update works (and immutability blocks tampering).
- **`getCompanyProfile()`** in [src/lib/company/profile.ts](../src/lib/company/profile.ts) still uses `.single()` and a `@ts-ignore`; it's only reached for the `ok` context now, but consider migrating it to `getCompanyContext()` and fixing the ts-comment during cleanup.

---

## 19. TB-015.4 — Status: ✅ COMPLETE (was listed as "next" in the brief — it's done)

- **Commit:** `e8f0848` — `fix(booking): enforce booking immutability`.
- **Files/migration:** [20260627200000_harden_booking_immutability.sql](../supabase/migrations/20260627200000_harden_booking_immutability.sql), [src/lib/company/bookings.ts](../src/lib/company/bookings.ts).
- **What it did:** added a `BEFORE UPDATE` trigger `bookings_enforce_immutability` (`SECURITY INVOKER`) that, for `authenticated` (company) users, blocks any change to protected/snapshot columns (`id, booking_reference, departure_id, trek_id, company_id, customer_name, customer_email, customer_phone, travellers_count, departure_date, departure_price, total_amount, notes, created_at`), raising `"Company users may only update booking status."`. Company users may change only `status` (+ trigger-maintained `updated_at`). `auth.role() <> 'authenticated'` (service_role admin, and NULL internal/SECURITY-DEFINER/migrations) passes through. App layer also validates `status` against the allowed set in `updateCompanyBookingStatus`.
- **Why a trigger, not column GRANTs:** RLS governs rows, not columns; Supabase grants table privileges to `authenticated` by default and tooling can re-grant; a trigger is robust + gives a clear error.
- **`notes` decision:** treated as **immutable** for company users (no company-notes feature exists). Revisit only if such a feature is intentionally added.
- **Verify migration applied** (see §26).

**Therefore the real "next exact ticket" is NOT TB-015.4.** It is **TB-015.5 — cleanup + end-to-end verification + push** (see §28 and §25).

---

## 20. Future TB-016 Master Trek Architecture Plan (accepted; do NOT start until TB-015 hardening + e2e done)

- **TB-016.1** — Schema: `master_treks` table + `treks.master_trek_id` (nullable FK) + indexes + RLS + optional summary view/RPC (operator count, starting price, earliest/total upcoming departures). Decide `region_id` FK and `(master_trek_id, company_id)` uniqueness.
- **TB-016.2** — Admin Master Trek CMS (mirror Regions/Treks editors).
- **TB-016.3** — Link company packages to master treks (picker in admin + company `TrekEditor`; company "request new master trek" flow with admin approval; server-side validation).
- **TB-016.4** — Search returns master treks (`searchMasterTreks` + `MasterTrekCard`); flip `/search` UI.
- **TB-016.5** — Master Trek Marketplace Page `/treks/[masterTrekSlug]` (operator comparison list, filters, sort).
- **TB-016.6** — Company Package Page `/treks/[masterTrekSlug]/[packageSlug]` (reuse `components/trek/details/*` + booking modal).
- **TB-016.7** — Booking flow verification on the new route (RPC unchanged; correct departure passed).
- **TB-016.8** — SEO: 301 redirects from legacy `/treks/[slug]`, canonicals, structured data, sitemap.
- **TB-016.9** — Data migration/cleanup (assisted backfill of master treks from existing titles with admin review; nullable fallback).

Suggested ordering tweak: run the backfill (016.9) right after 016.3, before flipping search/marketplace (016.4–016.6), so the public layer launches against clean data.

---

## 21. Future Route Architecture (TB-016)

- `/search` → returns **master treks** (`MasterTrekCard` with operators-available, starting price, earliest departure).
- `/treks/[masterTrekSlug]` → **marketplace comparison page** (operators for that trek).
- `/treks/[masterTrekSlug]/[packageSlug]` → **company package details** + booking.
- **Legacy `/treks/[slug]`:** keep working via a fallback resolver (look up master slug first, else legacy package), and **301-redirect** old package URLs to the new canonical to preserve SEO. Guard against master/package **slug collisions** at write time (both currently share the `/treks/[…]` namespace; `treks.slug` is globally unique today).

---

## 22. Future Database Architecture (TB-016)

- New `master_treks` (a.k.a. `trek_routes`): canonical route-level content (`name`, `slug`, `region_id` FK→regions, difficulty, duration range, altitude, best_season, overview, `highlights[]`, route map, cover/gallery, SEO, `status`).
- `treks.master_trek_id` nullable FK → `master_treks(id)` (ON DELETE SET NULL). Nullable = backward-compatible; null-master packages render via the legacy resolver.
- Possible `master_trek_requests` table (company-requested masters pending admin approval).
- Possible **summary view/RPC** for aggregates (starting price, operator count, earliest departure).
- **`departures` and `bookings` remain unchanged.** RLS: public read active master treks; companies manage only their own packages (unchanged); no company write on `master_treks`.

---

## 23. Security Principles To Preserve (non-negotiable)

- Never trust frontend `company_id` — always derive from the authenticated session.
- Never trust frontend pricing — all money math is server-side (RPC).
- Never let a company access another company's data (RLS + explicit `company_id` filters).
- Never let public write `departures` (TB-015.1).
- Never let company users edit booking financial/snapshot fields (TB-015.4 trigger).
- Admin uses `service_role`; Company uses Supabase Auth + RLS; Public books only via the safe server action + `SECURITY DEFINER` RPC.
- Bookings belong to departures; departure capacity is protected (RPC lock + `chk_departures_seats`).
- One auth user ↔ at most one company (`companies_owner_id_unique`, TB-015.3).

---

## 24. What Antigravity Must NOT Do

- Do **NOT** call TrekBazaar a "project" — it is a startup / marketplace / platform.
- Do **NOT** rewrite the `create_booking` RPC casually.
- Do **NOT** implement Master Trek (TB-016) before TB-015 hardening + end-to-end verification are finished.
- Do **NOT** add public company self-registration.
- Do **NOT** build payments, reviews, customer portal, mobile app, or enterprise CRM yet.
- Do **NOT** weaken RLS; do **NOT** create `USING(true)` / `WITH CHECK(true)` policies.
- Do **NOT** accidentally stage/commit `docs/TREKBAZAAR_ENGINEERING_CAPSULE.md` or this capsule.
- Do **NOT** push to origin without explicit user approval.
- Do **NOT** fix unrelated lint/files inside a focused security ticket (report them instead).

---

## 25. Recommended Next Prompts For Antigravity

**Prompt 1 (read-only verification):**
> "Read docs/TREKBAZAAR_ANTIGRAVITY_HANDOFF_CAPSULE.md fully, inspect the repo, verify current git status and which migrations are actually applied in Supabase, and report whether TB-015.4 (booking immutability) is committed and whether migrations 20260627170000–20260627200000 are live. Confirm whether the 4 local commits are pushed. Do not code."

**Prompt 2 (cleanup, the real next ticket — see §28):**
> "TB-015.5 — Cleanup & End-to-End Verification: add `export const dynamic = 'force-dynamic'` to /admin/bookings; fix the search `best_seasons`→`best_season` bug (and optionally extend text search to description); fix the lint errors (scripts/*.js require → import, profile.ts @ts-ignore → @ts-expect-error); then run a full end-to-end booking test (admin creates company → provision login → company creates trek + departure → public books → seat decrement + booking visible in admin & company → status update works → immutability blocks tampering). Keep each fix focused; do not start TB-016."

**Prompt 3 (only after TB-015 fully verified):**
> "Begin TB-016.1 — Master Trek schema migration (master_treks + treks.master_trek_id nullable + indexes + RLS + optional summary view). Planning/migration only; do not touch the booking engine."

If you prefer to keep numbering as the brief implied, you may instead re-run "TB-015.4" as a verification — but the repo shows it is already implemented at `e8f0848`; treat it as **verify, not build**.

---

## 26. Manual Supabase Tasks

Migrations that may need manual application (verify first — see §18):
- `20260627170000_fix_departures_rls_security.sql` (TB-015.1 — user said applied; verify)
- `20260627180000_fix_treks_legacy_operator_fields.sql` (TB-015.2)
- `20260627190000_harden_company_owner_identity.sql` (TB-015.3)
- `20260627200000_harden_booking_immutability.sql` (TB-015.4)

Apply via `npx supabase db push` (or run each file's body in the dashboard SQL editor — all are written idempotently). If CLI history is out of sync with a dashboard-applied DB, reconcile with `npx supabase migration list` / `npx supabase migration repair` and verify against the live schema before pushing.

**Verification SQL:**
```sql
-- A. Departures policies (TB-015.1): expect 2 — public SELECT (is_active AND status in Upcoming/Full),
--    company ALL own. NO FOR ALL USING(true).
select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname='public' and tablename='departures' order by policyname;

-- B. Treks operator fields nullable (TB-015.2): expect is_nullable = YES for both.
select column_name, is_nullable from information_schema.columns
where table_schema='public' and table_name='treks'
  and column_name in ('operator_name','operator_contact');

-- C. Companies one-owner unique index (TB-015.3): expect companies_owner_id_unique ... WHERE (owner_id IS NOT NULL).
select indexname, indexdef from pg_indexes
where schemaname='public' and tablename='companies' and indexdef ilike '%owner_id%';

-- D. Booking immutability (TB-015.4): expect trigger bookings_enforce_immutability + function present.
select trigger_name, action_timing, event_manipulation
from information_schema.triggers
where event_object_schema='public' and event_object_table='bookings' order by trigger_name;

-- E. Booking status CHECK (already from 130000): Pending/Confirmed/Rejected/Cancelled/Completed.
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid='public.bookings'::regclass and contype='c';
```

---

## 27. Current Product Reality (brutally honest)

TrekBazaar has a **strong marketplace foundation**: correct `Company → Trek → Departure → Booking` modeling, an architecturally **excellent booking engine** (locked, server-priced, snapshotted, overbooking-proof), RSC-first public site, a real Admin portal, and a Company Portal that is **mostly implemented and now meaningfully hardened** (departures RLS, trek ownership, identity resolution, booking immutability).

But it is **NOT fully production-ready**. Open: migrations may not be live in the DB; nothing is pushed; lint is red; `/admin/bookings` renders static; a search filter is broken; admin can't change booking status in the UI; and **no full end-to-end booking flow has been verified**. The historical `TREKBAZAAR_ENGINEERING_CAPSULE.md` over-claims "production ready" — do not repeat that claim. Treat the system as **solid foundation + hardening in progress**.

---

## 28. Final Handoff Summary

TB-015.1, TB-015.2, TB-015.3, **and TB-015.4 are implemented** (commits `83e4fb3`, `560763f`, `300a965`, `e8f0848`; local ahead of origin by 4, unpushed). The brief that requested this capsule assumed TB-015.4 was still pending — **the repo proves it is complete.**

**Antigravity should resume from TB-015.5 (cleanup + full end-to-end verification + push) — not by rebuilding TB-015.4 — unless repo inspection proves TB-015.4 is somehow missing. Do not start TB-016 until TB-015 hardening is verified end-to-end and migrations are confirmed live in Supabase.**
