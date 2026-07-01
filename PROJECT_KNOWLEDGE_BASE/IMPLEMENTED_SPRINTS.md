# Implemented Sprints

## Sprint 1: The Core Foundation & Search V2
**Goal**: Establish the fundamental B2C marketplace architecture and the Master Trek discovery engine.
**Architecture**: Transitioned from fragmented "operator treks" to canonical "Master Treks". Created `v_search_master_treks` to aggregate data securely.
**Important Decisions**: Locked the design system. Established Aesthetic Authority. Chose Next.js App Router with Server Components for extreme SEO and load performance.
**Lessons Learned**: Complex database views are fragile during migrations; always plan for `CASCADE` drops when modifying underlying enum types.

## Sprint 2: B2B Onboarding Refinements (Phase 1.1)
**Goal**: Fortify the database architecture to support a robust B2B onboarding state machine.
**Architecture**: 
- Created `onboarding_status_enum`.
- Stripped document URLs out of the `companies` table.
- Created `partner_documents` (1-to-many) with `document_type_enum`.
- Created `partner_application_history` for full audit trails.
**Important Decisions**: The realization that storing 4 specific document URL columns in `companies` was unscalable and prevented re-uploads or granular Admin review. The pivot to a dedicated table was crucial for enterprise SaaS capabilities.
**Commit**: `19c3f0d`

## Sprint 3: Enterprise Wizard & Company Info (Phase 2 - Milestone 1)
**Goal**: Transform the onboarding experience from a generic form to a Stripe-Atlas level progressive wizard.
**Architecture**:
- Built `/partner/onboarding/layout.tsx` with a sticky progressive-disclosure sidebar.
- Transformed `/partner/onboarding/page.tsx` into a smart status-based redirector.
- Built auto-saving Client Components backed by Server Actions (`actions.ts`).
**Important Decisions**: Implemented `onBlur` and `useTransition` auto-saving. Decided to keep the URL structure flat but visually progress the user.
**Commit**: `f69767f`

## Sprint 4: Due Diligence & KYC (Phase 2 - Milestone 2)
**Goal**: Build a scalable, database-driven document upload system.
**Architecture**:
- Created the reusable `DocumentUploadCard`.
- Integrated directly with Supabase storage (`uploadMedia`) and the new `partner_documents` table.
- Mapped UI strictly to the `document_type_enum` (PAN, GST, etc.).
**Important Decisions**: Ensuring the `DocumentUploadCard` accepts a `readOnly` prop so it can be 100% reused by the Admin Review interface later without duplicating UI code.
**Commit**: `bbbee8f`

## Sprint 5: Commercial Terms & Banking (Phase 2 - Milestone 3)
**Goal**: Establish legal compliance and secure payout configuration.
**Architecture**:
- Built `TermsForm` with a custom scroll-to-bottom intersection observer enforcing legal reading.
- Built `BankingForm` capturing IFSC and Account details with strict Regex validation.
- Reused `DocumentUploadCard` for Bank Proof.
- Added a Review Preview screen masking sensitive account numbers.
**Important Decisions**: Treating legal acceptance as a serious digital signature (storing UTC timestamp and version) rather than a throwaway checkbox.
**Commit**: `37f4b85`
