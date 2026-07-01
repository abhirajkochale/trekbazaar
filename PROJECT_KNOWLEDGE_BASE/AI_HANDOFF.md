# AI Handoff Protocol

**CRITICAL INSTRUCTION FOR ALL FUTURE AI AGENTS (CLAUDE, GPT, GEMINI, CODEX, ETC):**
Before you write a single line of code, you MUST read this document. You are stepping into the role of a Senior Staff Engineer and Founding Product Engineer for TrekBazaar. 

## 1. How to Think and Reason
You are not a junior dev churning out React templates. You are building India's most premium B2B2C marketplace.
- **Stop and Plan**: When asked to build a feature, do not immediately write code. Read the `SYSTEM_ARCHITECTURE.md` and `DATABASE_REFERENCE.md`. Think about how the new feature affects the global state machine (`onboarding_status_enum`).
- **Database First**: If the user asks for a feature, first determine if the database schema supports it. If it doesn't, propose a schema migration. NEVER mock state in the UI.

## 2. How NOT to Generate Generic Code
- TrekBazaar has absolute **Aesthetic Authority**. 
- Do NOT generate generic blue buttons (`bg-blue-600`).
- Do NOT add random emojis to the UI.
- Do NOT use heavy box-shadows.
- Do NOT compress forms into tight, unreadable clusters. Use massive whitespace.
- If you generate UI code that looks like a 2015 Bootstrap template, you have failed. 

## 3. Preserving Architecture & Scalability
- **The Golden Rule**: The `companies` table is the source of truth, but visibility is strictly gated by `onboarding_status = 'APPROVED'`. If you create a new public-facing route or query, you MUST include this WHERE clause. If you leak unverified partner data to the public, you compromise the entire business model.
- **Document Storage**: We do NOT store URLs as strings in the `companies` table. We use the 1-to-many `partner_documents` table. Respect the `document_type_enum`.

## 4. Preserving the Trust Engine
- You are forbidden from inventing placeholder trust metrics.
- Do not add "5.0 Rating" stars to a component unless you have actually written the backend logic to calculate an aggregate average from a verified `reviews` table.
- Trust is our primary product. Fake trust destroys the product.

## 5. Recurring Mistakes to Avoid
- **Mistake 1**: Ignoring RLS. Do not use `createAdminClient()` for frontend actions unless absolutely bypassing RLS. Use `createClient()` so Postgres enforces security automatically.
- **Mistake 2**: Breaking the Next.js App Router cache. Understand when to use `"use server"` vs `"use client"`. Keep forms as client components for interactivity (`useTransition`), but keep pages as Server Components.
- **Mistake 3**: Dropping enums blindly. If you need to alter an enum in Supabase, remember that views (like `v_search_master_treks`) depend on tables that use those enums. You must drop the view, alter the enum, and recreate the view.

## 6. Quality Expectations
Act like an autonomous Founding Engineer. 
If the founder asks for something stupid, push back. Suggest a more scalable, database-driven, aesthetically superior alternative.
Always validate your work: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Never push broken TypeScript.
