# TrekBazaar: Business Domain Model

## 1. Core Business Entities

**Operator**
- *Purpose*: Represents a verified trekking business or agency on the platform.
- *Responsibilities*: Managing company profile, onboarding staff, creating treks, scheduling departure batches, and fulfilling bookings.
- *Relationships*: Owns many Treks. Manages many Enquiries and Bookings.
- *Examples*: "Indiahikes", "Bikat Adventures", "Trek The Himalayas".

**Trek (The Product)**
- *Purpose*: Represents a specific route or expedition experience.
- *Responsibilities*: Holding the static, evergreen information about the journey (itinerary, difficulty, region, gear list).
- *Relationships*: Belongs to one Operator. Has many Departure Batches. Has many Media Assets. Belongs to one Region.
- *Examples*: "Roopkund Trek", "Kedarkantha Winter Trek".

**Departure Batch (The Inventory)**
- *Purpose*: Represents a specific scheduled occurrence of a Trek in time.
- *Responsibilities*: Managing availability, specific seasonal pricing, start/end dates, and trek leader assignments.
- *Relationships*: Belongs to one Trek. Has many Bookings.
- *Examples*: "Kedarkantha - Dec 15 to Dec 20, 2027 (Capacity: 20)".

**Trekker (Customer)**
- *Purpose*: The end-user who explores, inquires, and eventually books.
- *Responsibilities*: Managing personal profile, medical information, and booking history.
- *Relationships*: Creates many Enquiries. Owns many Bookings. Writes many Reviews.

**Enquiry (Lead)**
- *Purpose*: Capturing high-intent interest before the booking engine is available, or for custom group requests.
- *Responsibilities*: Tracking communication state between a Trekker and an Operator.
- *Relationships*: Created by one Trekker (or Guest). Belongs to one Operator (and optionally one Trek).

**Booking**
- *Purpose*: A committed reservation for a Trekker on a specific Departure Batch.
- *Responsibilities*: Tracking seat reservations, participant details, and booking status.
- *Relationships*: Belongs to one Trekker and one Departure Batch. Has many Payments.

**Payment**
- *Purpose*: A financial transaction related to a Booking.
- *Responsibilities*: Tracking deposits, full payments, refunds, and gateway transaction IDs.
- *Relationships*: Belongs to one Booking.

**Review**
- *Purpose*: Verified feedback from a Trekker after completing a trek.
- *Responsibilities*: Building trust and providing a public rating.
- *Relationships*: Belongs to one Trekker, one Booking, and one Trek.

**Media Asset**
- *Purpose*: Centralized management of photos, videos, and PDFs.
- *Responsibilities*: Providing visual collateral for Treks and Operators.
- *Relationships*: Belongs to a Trek or an Operator.

**Region / Location**
- *Purpose*: Geographic taxonomy for organizing and searching treks.
- *Responsibilities*: Grouping treks by state, mountain range, or national park.
- *Relationships*: Has many Treks.
- *Examples*: "Garhwal Himalayas", "Himachal Pradesh".

**Admin**
- *Purpose*: Platform staff.
- *Responsibilities*: Moderating content, approving Operators, handling disputes, overseeing the marketplace.

**Trek Leader / Guide**
- *Purpose*: Specific staff members employed by Operators.
- *Responsibilities*: Leading the actual physical trek. Assigned to Departure Batches for transparency.

**Coupon / Promotion**
- *Purpose*: Marketing tools for discounts.
- *Responsibilities*: Holding discount logic (percentage vs. flat rate) and validity dates.
- *Relationships*: Applied to many Bookings.

---

## 2. Relationships

- **One Operator &rarr; Many Treks**: An operator curates a catalog of routes they run. A trek is exclusively owned by one operator.
- **One Trek &rarr; Many Departure Batches**: A single route (e.g., Hampta Pass) is scheduled dozens of times a year. The Trek holds the itinerary; the Batch holds the dates and capacity.
- **One Trek &rarr; Many Media Assets**: A gallery of images attached to a single route.
- **One Region &rarr; Many Treks**: A structural hierarchy allowing trekkers to filter by geography.
- **One Trekker &rarr; Many Enquiries**: A customer can ask questions about multiple treks before deciding.
- **One Trekker &rarr; Many Bookings**: A customer builds a history of trips over their lifetime.
- **One Departure Batch &rarr; Many Bookings**: A batch has a maximum capacity (e.g., 20 seats) filled by multiple independent bookings.
- **One Booking &rarr; Many Payments**: A single booking may involve a partial deposit, a final balance payment, and potentially a refund.
- **One Booking &rarr; One Review**: A trekker can only review a trek if they have a confirmed, completed booking for it (Verified Reviews).
- **One Operator &rarr; Many Trek Leaders**: An operator employs multiple guides who are assigned to specific Departure Batches.

---

## 3. Business Lifecycle

- **Operator Lifecycle**: `Draft` (Onboarding/KYC) &rarr; `Pending Approval` (Admin review) &rarr; `Active` (Live on platform) &rarr; `Suspended` (Policy violation) / `Archived` (Out of business).
- **Trek Lifecycle**: `Draft` (Being written by Operator) &rarr; `In Review` (Admin checking quality) &rarr; `Published` (Publicly visible) &rarr; `Archived` (No longer offered).
- **Departure Batch Lifecycle**: `Scheduled` (Future dates set) &rarr; `Open` (Taking bookings) &rarr; `Waitlisted / Full` (Capacity reached) &rarr; `In Progress` (Trek is happening right now) &rarr; `Completed` (Finished successfully) &rarr; `Canceled` (Aborted due to weather/logistics).
- **Enquiry Lifecycle**: `New` (Unread) &rarr; `Read` &rarr; `Responded` (Operator replied) &rarr; `Converted` (Became a booking) / `Closed` (Lost lead).
- **Booking Lifecycle**: `Initiated` (In cart) &rarr; `Pending Payment` (Awaiting gateway) &rarr; `Confirmed` (Deposit paid) &rarr; `Completed` (Trip finished) &rarr; `Canceled` (User dropped out) &rarr; `Refunded`.
- **Review Lifecycle**: `Pending` (Prompt sent to Trekker) &rarr; `Draft` &rarr; `Published` &rarr; `Flagged` (Reported by Operator) &rarr; `Removed` (Admin intervention).

---

## 4. Entity Ownership

| Entity | Who Creates? | Who Edits? | Who Deletes/Archives? | Who Views? |
|--------|--------------|------------|-----------------------|------------|
| **Operator** | Operator (Signup) / Admin | Operator / Admin | Admin | Public |
| **Trek** | Operator | Operator / Admin | Operator (Archive) / Admin | Public |
| **Departure Batch** | Operator | Operator | Operator | Public |
| **Enquiry** | Trekker / Guest | Operator (Status only) | Admin | Operator / Admin |
| **Booking** | Trekker | System (Status) / Admin | Trekker (Cancel) / Admin | Trekker / Operator / Admin |
| **Payment** | System (Webhook) | System | System (Refunds) | Trekker / Operator / Admin |
| **Review** | Trekker | Nobody (Append-only) | Admin (Moderation) | Public |
| **Media Asset**| Operator / Admin | Operator / Admin | Operator / Admin | Public |

---

## 5. Future Expansion

This domain model is inherently designed for future complexity:
- **Multiple Trek Leaders**: A junction entity connects the `Trek Leader` to the `Departure Batch`. This does not affect the core `Trek` definition.
- **Multiple Images**: Separating `Media Asset` from `Trek` allows infinite galleries, captions, and ordering without altering the `Trek` structure.
- **Multiple & Seasonal Pricing**: Pricing is shifted from the evergreen `Trek` to the specific `Departure Batch`, allowing a New Year's batch to cost more than a monsoon batch.
- **Coupons**: A `Coupon` entity intercepts the calculation between `Booking` and `Payment`.
- **Waitlists**: Handled simply as a `Status` on the `Booking` entity associated with a full `Departure Batch`.
- **Bookings, Payments, Refunds**: Supported natively by separating `Booking` (the reservation contract) from `Payment` (the financial ledger entry).
- **Reviews**: Tied directly to the `Booking`, mathematically guaranteeing that all reviews are from verified, paid customers.
- **Wishlists**: A simple junction entity between `Trekker` and `Trek`.

---

## 6. Data That Should NEVER Be Stored

- **Credit Card Data (PAN, CVV)**: Never stored. Passed directly to PCI-compliant gateways (e.g., Razorpay, Stripe); we only store the resulting transaction tokens.
- **Plaintext Passwords**: Must be hashed (e.g., bcrypt/Argon2) handled by the Auth provider.
- **Aggregated Totals**: Do not store fields like `total_bookings` on the Operator entity. This is derived data that should be calculated via queries or OLAP cubes to prevent race conditions and data anomalies.
- **Highly Sensitive Medical Data**: While trekkers must declare fitness, extremely sensitive HIPAA-level medical histories should not be stored permanently in plaintext. Collect only what is operationally required for the trek and purge post-trip if necessary.

---

## 7. Version Planning

**Version 1 (Lead Generation)**
- *Entities*: Admin, Trek, Enquiry, Region. (Operator is denormalized as text on the Trek).
- *Reasoning*: Prove demand. The fastest path to market. Connects buyers and sellers via email.

**Version 2 (Supplier Autonomy & Identity)**
- *Entities*: Operator (Normalized), Trekker (Accounts), Media Assets.
- *Reasoning*: Give operators dashboards to manage their own Treks. Give trekkers profiles so they don't have to re-type their details.

**Version 3 (Transactional Engine)**
- *Entities*: Departure Batch, Booking, Payment.
- *Reasoning*: Monetize the platform. Transition from a lead-gen directory to a true marketplace that takes a cut of transactions.

**Version 4 (Trust, Scale & Optimization)**
- *Entities*: Review, Coupon, Trek Leader, Support Ticket.
- *Reasoning*: Build community trust (Reviews), run marketing campaigns (Coupons), and scale customer service operations.

---

## 8. Final CTO Review

**Scalability Assessment**
If this exact domain model is utilized for the next five years, it natively supports scaling from **10 to 10,000 operators** and **100,000+ trekkers**.

The separation of **Trek** (the static catalog) from **Departure Batch** (the temporal inventory) is the masterstroke of this architecture. Without this separation, an operator running Roopkund 50 times a year would have to create 50 duplicate Trek listings, destroying the database, ruining SEO, and making reviews impossible to aggregate. By normalizing these, we maintain a clean catalog while supporting infinite inventory scaling.

**Identified Risks:**
1. **The V1 to V2 Migration**: V1 currently uses denormalized operators (text strings on the Trek). Migrating to V2 (Normalized Operators) will require a careful data migration script to deduplicate string names (e.g., merging "Indiahikes" and "India Hikes") into single Operator entities and re-linking the foreign keys on the Treks.
2. **Search Indexing**: At 10,000 operators and 50,000 treks, relational `LIKE` queries for search will become a massive bottleneck. The business domain supports this scale, but the *infrastructure* will need a dedicated search index (like Elasticsearch or Typesense) reflecting the `Trek` and `Region` entities.
3. **Concurrency**: During peak booking windows (e.g., a highly discounted batch), hundreds of trekkers might try to book the final 5 seats of a `Departure Batch`. The implementation of the `Booking` entity will require strict database transactions and row-level locking to prevent overselling. The domain model holds up, but the engineering execution must be precise.
