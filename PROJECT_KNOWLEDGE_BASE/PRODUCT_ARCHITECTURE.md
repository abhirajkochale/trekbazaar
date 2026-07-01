# Product Architecture

TrekBazaar is divided into three distinct product surfaces: Public Marketplace, Partner SaaS, and Admin Governance.

## 1. Public Marketplace (B2C)
The face of TrekBazaar. Its entire goal is to build trust and drive bookings.

### Homepage
- High visual impact. Hero search, curated collections (e.g., "Weekend Treks", "High Altitude"), and featured Master Treks.
- Optimized for SEO and instant loading via Next.js static rendering/ISR.

### Master Trek Page (`/treks/[slug]`)
- The single source of truth for a trek (e.g., Roopkund).
- Displays altitude, difficulty, standardized itinerary, and rich media.
- **The Engine**: Automatically queries `departures` from all `APPROVED` companies offering this trek, generating an apples-to-apples price and date comparison matrix.

### Company Profile (`/company/[slug]`)
- The microsite for a verified operator.
- Acts as their digital storefront. Displays their trust signals (Years Operating, Verified Partner), their specific departures, and their "About" information.
- Strictly gated: A company page returns a 404 if the operator's `onboarding_status` is not `APPROVED`.

### Search & Compare
- Uses `rpc_search_master_treks_weighted` to quickly find Master Treks.
- Compare Engine allows users to pit departures from different operators against each other based on price, dates, and operator trust scores.

## 2. Partner SaaS (B2B)
The operating system for trekking agencies.

### Partner Onboarding Wizard (`/partner/onboarding`)
- A Stripe-Atlas tier multi-step wizard.
- Ensures absolute compliance before an operator can access the marketplace.
- Broken into logical steps: Company Info -> Due Diligence (Documents) -> Commercial Terms -> Bank Details -> First Trek Creation -> Review.
- Driven by `onboarding_status_enum` progressive disclosure. Autosaves constantly.

### Partner Dashboard (`/partner/dashboard`)
- Gated behind `APPROVED` status. (Though parts unlock earlier to allow inventory creation).
- **Inventory Management**: Partners map their `departures` to existing `master_treks`.
- **Booking Management**: View and process customer bookings, track payouts (T+3 settlement cycle).
- **Profile**: Manage public-facing company data.

## 3. Admin Governance (Internal)
The control center for the TrekBazaar team.

### Partner Applications (`/admin/partner-applications`)
- The inbox for all operators in the `READY_FOR_REVIEW` state.
- Admins can view the exact data submitted in the onboarding wizard.
- They review `partner_documents` individually, marking them `APPROVED` or `REJECTED` (with `review_notes`).
- They govern the `onboarding_status` transitions, utilizing the `partner_application_history` for full auditability.

### Master Trek Management (`/admin/master-treks`)
- Admins create and maintain the canonical catalog of treks. Operators cannot create Master Treks to prevent duplication; they must request them from Admins.

### Global Dashboard
- Monitors marketplace liquidity (departures vs bookings), GMV, and platform health.

## Why This Architecture?
By splitting the platform into these three distinct zones, we enforce a strict separation of concerns. The public marketplace remains pristine, curated, and highly performant. The B2B layer is secure, complex, and state-heavy. The Admin layer acts as the absolute gatekeeper ensuring quality control.
