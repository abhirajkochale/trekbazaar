# Partner Onboarding System

The B2B Partner Onboarding System is the most sophisticated funnel in TrekBazaar. It ensures that only legitimate, high-quality, and legally compliant operators can access the marketplace.

## The State Machine (`onboarding_status_enum`)
Every company exists in exactly one of these states. The entire UI routes and blocks based on this state.

1. **`REGISTERED`**: The user has created an account and verified their email.
2. **`PROFILE_COMPLETED`**: The user has submitted basic company info (Name, Years Operating, Support contacts).
3. **`DUE_DILIGENCE`**: The user has uploaded all mandatory KYC documents to `partner_documents`.
4. **`TERMS_ACCEPTED`**: The user has scrolled through and digitally signed the Commercial Agreement (storing `terms_version` and `terms_accepted_at`).
5. **`KYC_COMPLETED`**: The user has submitted verified bank details and a cancelled cheque.
6. **`READY_FOR_REVIEW`**: The partner has created their first trek and departure, finalizing the wizard. The application is now locked and handed over to Admins.
7. **`UNDER_REVIEW`**: An Admin is currently looking at the application.
8. **`CHANGES_REQUESTED`**: An Admin rejected specific documents. The wizard unlocks *only* those specific document upload fields for the partner to fix.
9. **`APPROVED`**: The holy grail. The partner is now public. Dashboard features unlock fully.
10. **`REJECTED`**: Application denied.
11. **`SUSPENDED`**: A previously approved partner who violated platform rules.

## The UI Wizard
Located at `/partner/onboarding`, the UI acts as a smart router (`page.tsx`) implementing **Progressive Disclosure**. 
If a user tries to skip to `/partner/onboarding/banking` but their status is `PROFILE_COMPLETED`, the router forces them back to `/partner/onboarding/due-diligence`.
The layout features a sticky sidebar showing steps 1-8, visually communicating progress.

## Document Upload Architecture
- Uses a generic, highly reusable `DocumentUploadCard`.
- Supports image and PDF formats (up to 10MB).
- Uploads directly to Supabase Storage via `uploadMedia` action.
- Stores references in the `partner_documents` table with strict `document_type_enum` mappings.
- Completely decoupled from the `companies` table to allow versioning and granular rejection/approval per document.

## Commercial Agreement
To enforce real legal compliance, the Terms step uses a `useRef` based scroll-listener. The "I Accept" checkbox remains physically disabled until the user scrolls to the absolute bottom of the agreement text.

## Banking & Security
Collects standard Indian banking requirements (Account, IFSC). 
- Implements strict Regex validation for IFSC.
- Shows a review screen with masked data (`********1234`) before finalizing.
- Supabase is configured to encrypt these columns at rest for compliance.

## Autosave
Every input across the onboarding flow saves seamlessly using `useTransition` and `onBlur` server actions. A user can close the tab halfway through typing their bank account and return tomorrow exactly where they left off.
