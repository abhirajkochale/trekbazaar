# Remaining Roadmap

This roadmap organizes the path from Advanced MVP to a fully operational, revenue-generating platform.

## Immediate Priority (Next Sprint)
**Phase 2 - Milestone 4: First Trek & Departure Integration**
- *Goal*: Integrate the existing `TrekCreation` and `DepartureCreation` components into the onboarding wizard (`Step 6` and `Step 7`).
- *Why*: A partner cannot be reviewed by Admins until they have proven they can list inventory.
- *Complexity*: Low/Medium (Reusing existing components).

**Phase 2 - Milestone 5: Final Review & Submission**
- *Goal*: Build `Step 8`. A comprehensive read-only view of everything submitted, culminating in a "Submit Application" button that transitions status to `READY_FOR_REVIEW`.
- *Why*: The final lock on the application before Admin handoff.
- *Complexity*: Low.

**Phase 3: Admin Review Workflow**
- *Goal*: Build the internal dashboard at `/admin/partner-applications/[id]`.
- *Why*: Admins need to approve or reject the `partner_documents`. If rejected, the status must flip to `CHANGES_REQUESTED`. If approved, `APPROVED`.
- *Complexity*: Medium. Requires reusing `DocumentUploadCard` with `readOnly=true` and wiring up the status mutation RPCs/actions.

## Short Term Priority (Next 1-2 Months)
**Partner Dashboard Gating & Unlock**
- *Goal*: Finalize `/partner/dashboard` so features unlock sequentially based on onboarding status, but fully unlock at `APPROVED`.
- *Why*: Partners need to manage their business post-onboarding.
- *Complexity*: Medium.

**Checkout & Payment Gateway Integration**
- *Goal*: Integrate Stripe or Razorpay for customer bookings.
- *Why*: We need to collect money. The B2C side currently allows comparison but needs a secure transactional engine.
- *Complexity*: High. Involves webhooks, booking state machines (`PENDING`, `CONFIRMED`, `CANCELLED`), and handling split-payouts logically (though initially, we might collect 100% and payout manually T+3).

## Medium Term Priority (3-6 Months)
**Customer Dashboard & Booking Management**
- *Goal*: A portal for trekkers to view their itineraries, download invoices, and request cancellations.
- *Why*: Reduces manual support overhead and increases customer trust.
- *Complexity*: Medium.

**Verified Review System**
- *Goal*: Allow users with `COMPLETED` bookings to leave a rating and review for the operator.
- *Why*: Fuels the Trust Engine.
- *Complexity*: High. Requires complex database relationships to prevent fake reviews and ensure only verified customers can rate.

## Long Term Priority (1 Year+)
**TrekBazaar FinTech (Embedded Finance)**
- *Goal*: Offer Trek Insurance at checkout; offer working capital advances to operators based on their GMV.
- *Why*: Deepens platform lock-in and creates secondary revenue streams.
- *Complexity*: Extremely High. Requires third-party underwriting APIs.

**Global Expansion (Nepal / Bhutan)**
- *Goal*: Scale the Master Trek database to cover the Everest and Annapurna regions.
- *Why*: Expanding Total Addressable Market (TAM).
- *Complexity*: High (Logistical and multi-currency support).
