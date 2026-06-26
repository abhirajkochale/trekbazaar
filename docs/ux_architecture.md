# TrekBazaar User Experience Architecture

This document defines the complete User Experience (UX) Architecture for TrekBazaar Version 1. It focuses purely on user flows, information hierarchy, and behavioral interactions, providing the blueprint for designers and engineers to build a seamless lead-generation marketplace.

---

## 1. Information Architecture

### Public Pages
1. **Homepage (Discovery)**
   - *Purpose*: Inspire visitors, explain the value proposition, and facilitate rapid discovery.
   - *Primary CTA*: Search / Filter treks.
   - *Secondary CTA*: Submit a general enquiry.
   - *Access*: Public.
   - *Navigation*: Root `/`.

2. **Trek Details Page**
   - *Purpose*: Provide comprehensive information to qualify the user and drive conversion.
   - *Primary CTA*: "Enquire Now".
   - *Secondary CTA*: "Back to all treks".
   - *Access*: Public.
   - *Navigation*: `/treks/[slug]`.

3. **Legal Pages (TOS & Privacy)**
   - *Purpose*: Establish legal compliance and trust.
   - *Primary CTA*: None.
   - *Access*: Public.
   - *Navigation*: Footer links.

### Admin Pages
4. **Admin Login**
   - *Purpose*: Secure entry to the platform backend.
   - *Primary CTA*: "Sign in".
   - *Access*: Public (but authenticated).

5. **Admin Dashboard (Treks List)**
   - *Purpose*: Overview of the entire catalog.
   - *Primary CTA*: "Add New Trek".
   - *Secondary CTA*: "Edit" specific treks.
   - *Access*: Admin only.

6. **Admin Add/Edit Trek**
   - *Purpose*: Data entry for new and existing inventory.
   - *Primary CTA*: "Save trek".
   - *Secondary CTA*: "Cancel".
   - *Access*: Admin only.

7. **Admin Enquiries List**
   - *Purpose*: Centralized lead management (the CRM).
   - *Primary CTA*: Mark lead as "Responded" / "Closed".
   - *Access*: Admin only.

---

## 2. Visitor Journey

The ideal path from arrival to conversion:

1. **Landing**: Visitor arrives on the Homepage via SEO or direct link. The hero image immediately establishes the domain (Himalayan trekking).
2. **Search/Filter**: Visitor uses dropdowns (Region, Difficulty) or types a keyword.
3. **Scan Results**: The grid updates dynamically. Visitor compares thumbnails, prices, and durations.
4. **Decision Point 1**: Do any of these match my fitness level and budget? 
5. **Trek Details**: Visitor clicks a TrekCard. Navigates to the details page.
6. **Read & Evaluate**: Visitor scans the Hero Image, reads the Quick Facts (Price, Duration, Difficulty), then scrolls to read the detailed itinerary.
7. **Decision Point 2**: Do I trust this operator? Is this the right trek?
8. **Enquiry**: Visitor clicks the sticky "Enquire Now" button, auto-scrolling to the form.
9. **Form Submission**: Visitor enters Name, Email, and a brief message. Clicks Submit.
10. **Confirmation**: Instant on-screen success state. No page reload. "Thanks! The operator will contact you."

---

## 3. Trek Discovery Experience

- **Homepage Sections**:
  - *Hero*: Aspirational imagery + high-level value prop ("Find Your Next Trek").
  - *Filter Bar*: Prominent, sticky (or easily accessible) search controls.
  - *Catalog Grid*: Card-based layout displaying the treks.
  - *General Support*: A footer-level contact form for confused users ("Don't know where to start? Ask us.").
- **Search Behavior**: Instant client-side filtering. If a user types "Roopkund", the grid filters immediately without a page reload.
- **Filtering Behavior**: Dropdowns for discrete categories (Region, Difficulty).
- **Pagination vs. "Load More"**: Use a "Load More" button rather than infinite scroll. Infinite scroll prevents users from ever reaching the footer (which contains important trust/legal links).
- **Empty States**: If a search yields zero results, do not show a blank page. Show: *"We couldn't find a trek matching those filters. Try widening your search, or drop us a general enquiry below and we'll help you find one."*

---

## 4. Trek Details Experience

The layout of the Trek Details page is optimized to build trust sequentially:

1. **Hero Image**: 16:9 high-quality immersive image. Purpose: Emotional hook.
2. **Title & Badges**: Trek Name + Difficulty Badge. Purpose: Immediate identification.
3. **Quick Facts Grid**: Region, Duration, Base Price. Purpose: Logical qualification (Can I afford it? Do I have the time?).
4. **Primary CTA**: "Enquire Now". Placed above the fold for returning users ready to act.
5. **Detailed Description**: The narrative itinerary. Purpose: Deep evaluation.
6. **Operator Card**: Operator Name and verified status. Purpose: Establishing trust that a real, professional company runs this.
7. **Enquiry Form**: The bottom terminus of the page. Purpose: Conversion.

---

## 5. Enquiry Flow

The lead generation experience must be frictionless.

- **Data Collection**: 
  - *Name* (Required)
  - *Email* (Required)
  - *Phone* (Optional, but highly recommended by operators)
  - *Message* (Optional, pre-filled with "I'm interested in [Trek Title]")
- **Friction Reduction**: Do not ask for travel dates, group size, or medical history in V1. Those create drop-off. Let the operator ask those questions during their sales follow-up.
- **Confirmation State**: Replaces the form inline upon submission with a green checkmark and reassuring text. Do not redirect to a generic `/thank-you` page, which breaks the user's context.

---

## 6. Admin Experience

The Admin UX prioritizes speed of data entry and lead triage.

- **Manage Enquiries (Daily Workflow)**: The admin logs in and sees the Enquiries dashboard first. A list of leads ordered by newest. The admin manually ensures the operator has been notified, then clicks "Mark Responded" to clear the queue.
- **Add Treks (Content Creation)**: A single-page, long-scroll form. Slugs auto-generate based on the title to save time. Validation ensures no trek is published without mandatory fields (Price, Duration).
- **Moderate Content**: Admins can instantly flip a Trek's status from "Active" to "Draft" to hide it from the public catalog if an operator reports it is fully booked or closed for the season.

---

## 7. Mobile Experience

Given ~70% mobile traffic, TrekBazaar must be designed Mobile-First.

- **Thumb-Friendly Navigation**: On mobile, the "Enquire Now" CTA on the Trek Details page should become a **sticky bottom bar**. As the user scrolls through a long itinerary, the button remains pinned to the bottom of the screen, always in reach of the thumb.
- **Filter UX**: Instead of squished inline dropdowns, clicking "Filters" on mobile should open a bottom-sheet modal overlay, giving the user full-screen space to tap large checkboxes/options.
- **Form Inputs**: HTML inputs must use correct types (`type="email"`, `type="tel"`) to trigger the correct native mobile keyboards (e.g., bringing up the number pad for phone numbers).

---

## 8. SEO Experience

- **Discovery**: Trekkers will search Google for long-tail keywords (e.g., "Kedarkantha trek price 2027", "Best moderate treks in Himachal").
- **Page Architecture**: Every Trek Details page (`/treks/[slug]`) acts as an SEO landing page. 
- **Content Structure**: Semantic `<h1>` for the trek title, `<h2>` for sections like "Itinerary". 
- **Performance**: Near-instant TTFB (Time to First Byte) using Server Components ensures Google ranks the site highly for speed.

---

## 9. Future Experience (Evolution)

- **When Operator Dashboards arrive**: Operators will log into a simplified version of the admin panel. The UX shifts from "Admin does everything" to a multi-tenant SaaS feel. Operators will have a Kanban board for their leads.
- **When Customer Accounts arrive**: The header gains a "Log In" button. Trekkers get a "My Trips" dashboard. The enquiry form vanishes for logged-in users, replaced by a 1-click "Request Details" button since we already have their info.
- **When Bookings arrive**: The "Enquire Now" button changes to a "Check Availability" modal. The flow shifts from a simple form to a 3-step checkout: Select Date &rarr; Add Participants &rarr; Payment Gateway.

---

## 10. UX Principles

These 15 principles govern every design and engineering decision for TrekBazaar:

1. **Mobile-First Always**: Design for the smallest screen; scale up to desktop.
2. **Minimize Friction**: Ask for the absolute minimum data required to convert a visitor into a lead.
3. **Trust Through Transparency**: Never hide base prices or durations. Put facts upfront.
4. **Instant Feedback**: Every user action (filtering, submitting) must yield an immediate visual response (skeletons, spinners, or inline success states).
5. **No Dead Ends**: Empty search results must always offer an alternative action (general enquiry).
6. **Thumb-Zone Accessibility**: Critical CTAs must remain at the bottom of the screen on mobile devices.
7. **Clear Visual Hierarchy**: Users should know what to look at first (Image &rarr; Title &rarr; Price &rarr; CTA).
8. **Consistent Terminology**: A trek is a "Trek". A company is an "Operator". Never mix terms (e.g., "Expedition" or "Vendor") to avoid cognitive load.
9. **Speed is UX**: Pages must load instantly. Use caching and static generation aggressively.
10. **Native Inputs**: Leverage device-native UI for dates, numbers, and emails.
11. **Contextual Help**: Add micro-copy near form fields (e.g., "Operators prefer a phone number to confirm details quickly").
12. **Readable Typography**: Ample line-height and contrast for long itineraries; reading a 7-day trek plan shouldn't strain the eyes.
13. **Forgiving Forms**: Inline validation that explains *why* an input failed, rather than generic "Error" messages.
14. **Content Over Chrome**: The UI should be invisible; the stunning photography and trek data should be the hero.
15. **Respect the User's Inbox**: Set clear expectations upon submitting an enquiry ("Expect an email within 24 hours").
