# Known Issues

This document tracks unresolved technical, product, and business debt. It must be updated continuously.

## 1. Technical / Architecture
- **Supabase TypeScript Types Drift**: Occasionally, running `npx supabase gen types` overrides manual fixes made to `src/lib/types.ts`. We need a stricter pipeline to merge auto-generated types with our custom interfaces.
- **View Dependencies during Migrations**: Modifying core enums (like `onboarding_status_enum`) requires dropping and recreating views like `v_search_master_treks` because Postgres locks the schema. Future migrations modifying enums must use `CASCADE` drops and gracefully recreate the views.
- **Image Deletion**: When an operator replaces a document in `DocumentUploadCard` or changes their logo, the old file remains in the Supabase Storage bucket, creating orphaned files. We need a cron job or webhook to clean up unreferenced URLs.

## 2. UI / UX
- **Mobile Safari Input Zoom**: iOS Safari sometimes zooms in on inputs if the font size is strictly under 16px. Our design system uses `text-sm` (14px). We may need to force `text-base` strictly on mobile inputs to prevent this jarring UX.
- **Toast Overlap**: On mobile, `react-hot-toast` notifications sometimes overlap the sticky bottom navigation (if implemented). 

## 3. Performance
- **Image Optimization**: Uploaded KYC documents are served directly via public URLs. For high-resolution images, this wastes bandwidth. Next.js `<Image>` component should be strictly enforced to serve compressed WebP versions.
- **Search Engine Scaling**: `rpc_search_master_treks_weighted` uses basic `ilike` and weighted scoring. As the master trek database grows beyond 1,000 entries, this will slow down. We will eventually need to implement Postgres `tsvector` full-text search or integrate a dedicated engine like Algolia/Typesense.

## 4. Business Logic
- **Terms Versioning Edge Case**: If TrekBazaar updates the Commercial Terms to `v1.1.0-2027`, how do we force already `APPROVED` partners to re-sign? Currently, the state machine only asks during onboarding. We need a "blocking modal" on the Partner Dashboard for existing partners when `terms_version` is outdated.
- **Bank Detail Updates**: If an `APPROVED` partner changes their bank details, does it require Admin re-approval? Currently, they are locked, but if we allow editing, it should technically temporarily suspend payouts or flag for review. This workflow is undefined.
