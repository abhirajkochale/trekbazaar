# TrekBazaar Product Requirements Document (PRD)
**Version:** 1.0 (Lead Generation Marketplace)
**Status:** Approved for Development

---

## 1. Product Vision

**What problem are we solving?**
Finding trusted Himalayan treks is fragmented and overwhelming. Information is scattered across outdated, hard-to-navigate websites, making it difficult for adventure seekers to compare options, understand pricing, and contact reliable operators. 

**Who are we solving it for?**
- **Trekkers:** Adventure seekers looking for their next expedition who want a curated, trustworthy discovery experience.
- **Operators:** Local trekking companies seeking high-quality customer leads without managing complex digital marketing campaigns.

**Why does this product exist?**
To bridge the gap between trekkers and local operators by providing a centralized, beautifully designed, and easy-to-use directory that streamlines discovery and makes inquiring about a trek frictionless.

---

## 2. Product Goals

**What does success look like for Version 1?**
Version 1 is strictly a **Lead Generation Marketplace**. Success means launching a stable, curated directory of treks that successfully captures high-intent customer inquiries and delivers them to our partner operators.

**Measurable Goals (First 90 Days):**
- Launch with 50+ curated treks from at least 10 verified operators.
- Achieve a 5% conversion rate from unique visitor to submitted inquiry.
- Generate and deliver 100+ qualified leads to operators.

---

## 3. User Personas

### The Trekker
- **Goals:** Find the right trek based on region and difficulty, compare prices effortlessly, and contact the operator with a single click.
- **Pain Points:** Hidden pricing, unresponsive companies, untrustworthy websites, confusing itineraries.
- **Motivations:** Adventure, nature, ticking off a bucket-list experience, finding a safe and reliable guide.
- **Expected Experience:** A seamless, visually inspiring browsing experience on mobile with clear information and a frictionless inquiry form.

### The Operator
- **Goals:** Receive high-quality, serious leads to grow their business.
- **Pain Points:** Spending too much time on marketing, struggling to build a modern web presence, competing with giant aggregators, answering low-intent emails.
- **Motivations:** Increased bookings, steady revenue, focusing on guiding rather than IT.
- **Expected Experience:** Completely hands-off marketing. They provide their trek info to TrekBazaar once, and simply receive emails with customer details ready to be closed.

### The Admin
- **Goals:** Curate a high-quality catalog of treks, ensure leads are flowing smoothly to operators, and maintain platform integrity.
- **Pain Points:** Managing data entry for multiple operators, tracking which leads were sent to whom.
- **Motivations:** Building a successful marketplace, ensuring both supply (operators) and demand (trekkers) are satisfied.
- **Expected Experience:** A simple, efficient internal tool to add/edit treks and monitor the health of lead generation.

---

## 4. User Journeys

### The Visitor
1. Lands on the homepage and sees a visually inspiring hero section.
2. Browses the featured catalog of treks.
3. Uses the search bar or dropdowns to filter by a specific region or difficulty.
4. If they cannot find what they want, they fill out the "General Inquiry" form at the bottom of the page to ask for help.

### The Trekker
1. Finds a specific trek that matches their criteria.
2. Clicks through to the Trek Details page.
3. Reviews the itinerary, price, duration, and operator information.
4. Fills out the specific inquiry form attached to that trek (name, email, phone, message).
5. Receives an on-screen confirmation and waits for the operator to contact them directly to finalize the booking.

### The Admin
1. Logs into the secure internal admin portal.
2. Receives new trek details via email from an operator.
3. Clicks "Add Trek," fills out the business details, uploads a cover image, sets the status to 'Active', and publishes.
4. Monitors the inquiries dashboard daily to ensure leads are being captured and processed.

### The Operator (Manual Workflow)
1. Signs a partnership agreement with TrekBazaar.
2. Emails their trek itineraries, pricing, and photos to the Admin.
3. Waits.
4. Receives an automated email from TrekBazaar containing a lead's contact info.
5. Replies directly to the trekker via email or phone to close the sale.

---

## 5. Functional Requirements

- **Trek Discovery:** A public homepage displaying a catalog of all active treks.
- **Search & Filtering:** The ability to filter treks by region and difficulty level, and search by keyword (title/description).
- **Trek Details Page:** A dedicated, SEO-optimized page for every trek showcasing all relevant information (price, duration, operator, description, hero image).
- **General Inquiry:** A contact form on the homepage for visitors who need general assistance.
- **Specific Inquiry:** A contact form on every trek page tied directly to that specific expedition.
- **Admin Authentication:** A secure login portal restricted to platform administrators.
- **Trek Management:** An internal admin interface to create, read, update, and archive trek listings.
- **Inquiry Management:** An internal admin interface to view all submitted inquiries and track their status (open, responded, closed).

---

## 6. Features Explicitly Excluded

- **User Accounts:** Excluded to reduce friction. Trekkers should not need to remember a password just to ask a question.
- **Operator Dashboards:** Excluded to keep V1 simple. Admins will handle data entry to guarantee high quality, consistent formatting, and perfect spelling.
- **Direct Bookings & Payments:** Excluded because V1 is strictly a lead-generation model. Handling money requires significant legal, security, and operational overhead that would delay the launch.
- **Reviews & Ratings:** Excluded because we do not yet have verified past customers on the platform. Fake reviews destroy trust.
- **Real-time Availability:** Excluded because operators do not have a dashboard to sync their calendars.

---

## 7. Information Architecture

- **Pages:** Home, Trek Details, Admin Login, Admin Dashboard (Treks list, Inquiries list, Add/Edit Trek).
- **Navigation:** Header with Logo (links to Home). 
- **Filters:** Search bar, Region dropdown, Difficulty dropdown.
- **Content Hierarchy:** Hero Banner &rarr; Filter Bar &rarr; Grid of Treks &rarr; General Inquiry Form.
- **Footer:** Copyright, link to Terms of Service, link to Privacy Policy.
- **Legal Pages:** Dedicated text pages for Terms of Service and Privacy Policy.

---

## 8. Admin Responsibilities

- **Onboarding:** Collect trek data (itineraries, prices, photos) from new operators via email/phone.
- **Data Entry:** Manually enter and format all trek data into the Admin Dashboard to ensure a premium, editorial feel.
- **Curation:** Select and crop high-quality images for each listing.
- **Monitoring:** Check incoming inquiries daily to ensure the system is working.
- **Support:** Act as the middleman (if automation fails) to ensure operators receive their leads.
- **Maintenance:** Update prices or details when operators notify TrekBazaar of changes, and archive treks that are no longer operating.

---

## 9. Operator Responsibilities

- **Information Provision:** Provide accurate, up-to-date trek itineraries, pricing, difficulty ratings, and high-resolution photos to TrekBazaar via email.
- **Contact Info:** Provide a primary contact email and phone number for receiving leads.
- **Lead Response:** Respond promptly and professionally to all leads forwarded by TrekBazaar.
- **Updates:** Notify TrekBazaar immediately of any price changes, itinerary updates, or if a trek is discontinued.

---

## 10. Trek Data Model (Business)

From a business perspective, every trek must contain the following information:
- **Title:** The name of the expedition.
- **Description:** A comprehensive overview and day-by-day itinerary.
- **Region:** The geographic location (e.g., Himachal Pradesh, Uttarakhand).
- **Difficulty:** Categorized strictly as Easy, Moderate, Difficult, or Extreme.
- **Duration:** Total number of days.
- **Price Per Person:** The base cost in local currency.
- **Cover Image:** A high-quality hero photo that inspires wanderlust.
- **Operator Name:** The verified company running the trek.
- **Operator Contact:** The email or phone number where leads should be sent.
- **Status:** Draft (hidden), Active (public), or Archived (hidden).

---

## 11. Non-Functional Requirements

- **SEO:** Fast load times, semantic HTML, and dynamic meta tags for every trek page to rank highly on search engines for long-tail keywords.
- **Performance:** Sub-second page loads for the public catalog to prevent visitor bounce rates.
- **Mobile Experience:** Fully responsive design. 70%+ of traffic is expected to be mobile. Buttons and forms must be touch-friendly.
- **Accessibility:** High contrast text, clear form labels, and keyboard navigability.
- **Security:** Secure admin login, protection against form spam, and secure data transmission (HTTPS).
- **Scalability:** The architecture must handle traffic spikes during peak trekking seasons without downtime.
- **Trust:** A clean, professional, editorial-style design that inspires confidence in the platform and the operators.

---

## 12. Launch Requirements

**Must Have (Blockers for Launch):**
- Public catalog with working filters.
- Functional inquiry forms that successfully capture leads.
- Admin dashboard for complete CRUD (Create, Read, Update, Delete) operations on treks.
- Automated email forwarding (sending the lead's contact info directly to the operator).
- Privacy Policy and Terms of Service.
- Custom domain and SSL certificate.

**Can Wait (Post-Launch V1.X):**
- Advanced search (by date or price range).
- Rich media galleries (multiple images per trek).
- Automated operator onboarding flows.

---

## 13. Version 2 Preview

*V2 will transition TrekBazaar from a lead-generation directory to a full transactional marketplace.*

- **Operator Dashboard:** Allowing companies to log in, manage their own listings, and view leads directly.
- **Customer Accounts:** Allowing trekkers to save favorites, view inquiry history, and manage their profiles.
- **Bookings & Inventory:** Transitioning from lead-generation to guaranteed reservations with calendar syncing.
- **Payments:** Processing deposits or full payments directly on the platform.
- **Reviews:** A verified review system where trekkers can rate operators after their trip to build community trust.
