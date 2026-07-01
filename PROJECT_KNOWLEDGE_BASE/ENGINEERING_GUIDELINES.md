# Engineering Guidelines

These are the absolute, non-negotiable laws of contributing to the TrekBazaar codebase. If a PR violates these, it is rejected.

## 1. Architecture & State
- **Database Driven**: NEVER hardcode state that belongs in the database. If there are 6 document types, they exist as an enum in Postgres. The UI consumes this enum. 
- **Single Source of Truth**: Data must not be duplicated. We deleted document URLs from the `companies` table because they belong in `partner_documents`. 
- **Row Level Security (RLS)**: Never write a Supabase query assuming the server is entirely trusted unless using `createAdminClient()`. Standard server actions must use `createClient()` which inherently enforces the session user's RLS policies.

## 2. Component Reusability
- **Do Not Duplicate Logic**: If you are building a file upload UI for Admins to upload a Master Trek cover image, reuse `DocumentUploadCard` or `ImageUpload`. 
- **Decouple UI from State**: Components like `TermsForm` should accept `companyId` and `currentVersion` as props, they shouldn't fetch it themselves. This makes them reusable.

## 3. Design System Strictness
- **Never Change the Baseline**: You are not a rogue designer. Do not change primary colors, border radiuses, or spacing variables.
- **No Inline Styles**: Strictly use Tailwind CSS classes.
- **Respect Whitespace**: When in doubt, add more padding/margin, not less.

## 4. Workflow & Validation
- **Atomic Commits**: Commit after every logical milestone. Do not push one massive "implemented everything" commit.
- **Strict Validation Loop**: Before concluding any task or pushing code, you MUST run:
  1. `npm run lint`
  2. `npx tsc --noEmit`
  3. `npm run build`
  If there is a single warning, fix it. Do not push broken code.

## 5. Security
- **Never Expose Secrets**: Ensure `.env.local` variables are prefixed with `NEXT_PUBLIC_` ONLY if they actually need to be on the client. 
- **Mask PII Data**: Account numbers, PAN numbers, and Phone numbers should be masked in preview screens. 

## 6. AI Development Rules (For Human Operators using AI)
- When prompting an AI to build a feature, always provide this `ENGINEERING_GUIDELINES.md` and the `SYSTEM_ARCHITECTURE.md` as context.
- Force the AI to write an Implementation Plan (`implementation_plan.md`) before writing any code. Review it against these guidelines.
