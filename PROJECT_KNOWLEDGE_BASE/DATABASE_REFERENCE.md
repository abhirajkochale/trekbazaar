# Database Reference

TrekBazaar relies heavily on a robust, relational PostgreSQL schema managed via Supabase. We push as much logic and validation into the database as possible using Enums, constraints, and Row Level Security (RLS).

## Enums
1. **`onboarding_status_enum`**: The definitive state machine for B2B partners.
   - `REGISTERED` -> `PROFILE_COMPLETED` -> `DUE_DILIGENCE` -> `TERMS_ACCEPTED` -> `KYC_COMPLETED` -> `READY_FOR_REVIEW` -> `UNDER_REVIEW` -> `CHANGES_REQUESTED` -> `APPROVED` -> `REJECTED` -> `SUSPENDED`.
2. **`document_type_enum`**: Types of KYC documents.
   - `PAN`, `GST`, `COMPANY_REGISTRATION`, `OWNER_ID`, `BANK_PROOF`, `OTHER`.
3. **`document_status_enum`**: Status of an individual KYC document.
   - `PENDING`, `APPROVED`, `REJECTED`.

## Core Tables

### 1. `companies` (Operators)
The central entity for B2B partners.
- `id` (UUID, PK)
- `owner_id` (UUID, FK to `auth.users`): The user who created the company.
- `name`, `slug`, `logo_url`, `website`, `email`, `phone`, `address`, `city`, `state`: Profile fields.
- `gst_number`, `years_of_experience`: Business details.
- `onboarding_status` (onboarding_status_enum): Single source of truth for marketplace visibility. MUST be `APPROVED` to be seen publicly.
- `bank_account_holder_name`, `bank_account_number`, `bank_ifsc_code`, `bank_name`, `bank_branch_name`, `bank_account_type`: Encrypted/secure banking fields.
- `terms_version`, `terms_accepted_at`: Legal compliance records.

### 2. `partner_documents` (KYC)
Stores URLs to files uploaded during due diligence. Decoupled from `companies` to allow 1-to-many relationships (e.g., re-uploads, history).
- `id` (UUID, PK)
- `company_id` (UUID, FK to `companies`)
- `document_type` (document_type_enum)
- `file_url` (Text): URL pointing to Supabase storage.
- `status` (document_status_enum): Defaults to `PENDING`.
- `review_notes` (Text): Feedback from Admin if `REJECTED`.
- `uploaded_at` (Timestamp), `reviewed_at` (Timestamp), `reviewed_by` (UUID).

### 3. `partner_application_history` (Audit Log)
Immutable log of all state transitions for a company.
- `id` (UUID, PK)
- `company_id` (UUID, FK to `companies`)
- `previous_status`, `new_status` (onboarding_status_enum)
- `changed_by` (UUID, FK to `auth.users`): Who made the change (Partner or Admin).
- `notes` (Text): Optional context (e.g., "Missing PAN signature").
- `created_at` (Timestamp).

### 4. `master_treks` (Catalog)
The platform-owned canonical list of treks.
- `id`, `slug`, `name`, `description`, `cover_image`.
- `altitude`, `duration_days`, `difficulty`, `region`, `start_point`, `end_point`.
- `is_published` (Boolean).

### 5. `departures` (Inventory)
Specific dates and prices offered by an Operator for a Master Trek.
- `id` (UUID, PK)
- `master_trek_id` (UUID, FK to `master_treks`)
- `company_id` (UUID, FK to `companies`)
- `start_date`, `end_date`
- `price` (Numeric), `total_seats`, `available_seats`.

## Views & RPCs

### `v_search_master_treks` (View)
Joins `master_treks`, `departures`, and `companies`.
- **CRITICAL**: Contains a `WHERE c.onboarding_status = 'APPROVED'` clause. This ensures that no search query can ever return departures from unverified partners. It aggregates the minimum price, total active departures, and the count of verified companies running the trek.

### `rpc_search_master_treks_weighted` (Function)
Performs weighted full-text search across `master_treks` returning data formatted identically to `v_search_master_treks`.

## Migrations History
- `20260701020000_b2b_onboarding_schema.sql`: Introduced `onboarding_status_enum` and migrated legacy `status`/`verification_status` logic into the new unified state machine.
- `20260701030000_b2b_onboarding_refinements.sql`: Created `partner_documents` and `partner_application_history`, dropping legacy document URL columns from the `companies` table for a vastly more scalable B2B architecture.

## Data Flow
1. User registers -> Row created in `companies` with `REGISTERED`.
2. Wizard steps -> Company updates fields; uploads go to `partner_documents`. Transitions through `PROFILE_COMPLETED` -> `DUE_DILIGENCE` -> etc.
3. Submit -> Transitions to `READY_FOR_REVIEW`.
4. Admin reviews -> Sets `partner_documents.status`. If all good, sets company `onboarding_status = 'APPROVED'`.
5. The moment `APPROVED` hits, `v_search_master_treks` automatically exposes the operator's departures to the public marketplace.
