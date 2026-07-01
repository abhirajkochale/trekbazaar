# Founder Context Capsule

**WARNING TO ALL FUTURE AI AGENTS:**
This document is the permanent brain of TrekBazaar. It dictates how you must think, reason, and code. Discarding this context will result in unacceptable deviations from the product vision.

## Product Philosophy
TrekBazaar is built on the premise that **trust is the ultimate currency**. Trekking is an inherently risky activity; customers are placing their lives and hard-earned money in the hands of operators. Therefore, the platform must exude immense trustworthiness. 
We achieve this through:
1. **Aesthetic Authority**: The UI must look so premium and flawless that the user implicitly trusts the company behind it. If a component looks like a generic Bootstrap or Tailwind template, it fails the aesthetic authority test.
2. **Data Integrity**: We NEVER invent data. If a partner doesn't have reviews, we don't show a "0 Reviews" or fake "5 Stars" badge. We gracefully hide the component or rely on deriving trust from existing data (e.g., "Verified Partner", "Years Operating", "Active Departures").
3. **Frictionless Enterprise SaaS**: For our partners, TrekBazaar must feel like using Stripe, Linear, or Vercel. It must be highly responsive, auto-saving, deeply thoughtful, and utterly professional.

## Marketplace Philosophy
1. **The Master Trek Strategy**: The biggest decision we made was the `master_treks` vs `operator_treks` architecture. We rejected the model where every operator creates their own "Roopkund Trek" listing, which creates search spam and decision fatigue. Instead, TrekBazaar owns the SEO-optimized "Master Trek" page for Roopkund. Operators only create `departures` and attach them to the Master Trek. This allows us to show a unified Compare Engine ("5 operators offer this trek. Prices range from ₹9,000 to ₹12,000."). 
2. **Strict Gating**: No operator is public until they are explicitly `APPROVED`. A partner must traverse `REGISTERED` -> `PROFILE_COMPLETED` -> `DUE_DILIGENCE` -> `TERMS_ACCEPTED` -> `KYC_COMPLETED` -> `READY_FOR_REVIEW` -> `APPROVED`. This is a non-negotiable law of the database.

## Founder Decisions: Things We Rejected
- **Rejected**: Placeholder images and placeholder metrics (e.g., "100+ Happy Customers"). Reason: It degrades the brand. 
- **Rejected**: Long, monolithic forms. Reason: It causes drop-offs. We adopted a progressive-disclosure, multi-step wizard for onboarding.
- **Rejected**: Storing documents as simple text URL columns inside the `companies` table. Reason: It prevents scalability, versioning, and re-uploads when documents are rejected. We pivoted to a dedicated `partner_documents` table with explicit enums.
- **Rejected**: Generic UI updates. We froze the design system. Do not arbitrarily change typography, colors, or spacing just to "make it look different." The design language is locked. 

## Founder Decisions: Things We Approved
- **Approved**: A dedicated `partner_application_history` table to create an audit log of every onboarding status change.
- **Approved**: The use of a "Trust Engine" that composes trust signals strictly from database realities (e.g., verifying if an operator has uploaded their MSME certificate to grant a "Verified" badge).
- **Approved**: The "Scroll-to-accept" requirement for Commercial Terms. It enforces real legal consent.

## How to Think & Reason
When faced with a feature request:
1. **Does this improve Discovery, Trust, Comparison, Booking Confidence, Marketplace Identity, Operator Growth, or Customer Retention?** If NO, do not build it.
2. **Is this database-driven?** Never hardcode state. Everything from document types to onboarding steps should ultimately reflect a database reality.
3. **Is it scalable?** Think B2B SaaS. If an admin rejects a document, how does the partner know? The architecture must support the entire lifecycle, not just the happy path.
4. **Would Stripe, Linear, or Shopify build it this way?** This is the ultimate quality check. If the UI or UX feels cheap, convoluted, or "good enough for an MVP," rewrite it. We do not do "basic."
