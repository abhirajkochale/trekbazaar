# The Trust Engine

TrekBazaar's primary value proposition to the consumer is Trust. We are combating an industry plagued by fake Instagram pages, hidden costs, and unsafe operators.

The Trust Engine is our philosophy and technical implementation of proving an operator's legitimacy.

## Core Rule: NEVER INVENT DATA
If a metric does not exist in the database, it is not displayed on the UI. We do not use placeholder metrics to "make the page look full."

- ❌ Fake "5.0 Rating" when no reviews exist.
- ❌ "1,000+ Happy Trekkers" arbitrary text.
- ❌ "99% Response Rate" fabricated metric.

## Current Trust Signals (Implemented)
These are mathematically derived from existing, verified database realities:
1. **Verified Partner Badge**: Derived simply from `onboarding_status = 'APPROVED'`. This proves they passed stringent KYC, PAN, and Bank verification by our Admins.
2. **Years Operating**: Derived from the `years_of_experience` integer provided during onboarding and vetted by Admins.
3. **Active Treks**: A live count of the `departures` table linked to their `company_id`.
4. **Lowest Price Guarantee**: A comparative metric automatically calculated by `v_search_master_treks` grouping departures by Master Trek.
5. **Operating Regions**: A dynamic array built by aggregating the regions of the Master Treks they operate.

## Future Trust Signals (To Be Implemented)
When the supporting systems exist, the Trust Engine will expand gracefully to include:
1. **Verified Reviews**: Can only be left by customers with a `status = 'COMPLETED'` booking attached to their account for that specific departure.
2. **Safety Badges**: Admins will grant specific badges (e.g., "WFR Certified Guides", "Oxygen Equipped") based on physical audits or secondary document uploads.
3. **Trust Score**: An algorithmic score (0-100) combining review sentiment, cancellation rates (derived from the database), and years on the platform.

## Verification Philosophy
We act as the gatekeepers. A partner's word is not enough. 
The Trust Engine relies entirely on the Admin Governance layer manually reviewing the `partner_documents` table. We are building a high-barrier-to-entry marketplace. It is better to have 50 highly trusted operators than 500 unverified ones.
