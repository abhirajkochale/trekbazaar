-- Migration: Make legacy treks operator fields nullable (TB-015.2)
-- Created at: 2026-06-27 18:00:00
--
-- CONTEXT:
--   treks.operator_name and treks.operator_contact were required (NOT NULL) in
--   the original single-operator schema (20260626000000). The marketplace
--   pivot represents the operator via treks.company_id -> companies, so these
--   columns are now DEPRECATED denormalized cache fields, not source of truth.
--
--   Keeping them NOT NULL is a footgun: any insert path that doesn't supply
--   them (admin or company) fails at the database level. This migration drops
--   the NOT NULL constraint so the deprecated fields can be omitted or left
--   null. The Company Portal still populates them (from the company profile)
--   for public display; see src/lib/company/treks.ts.
--
--   DROP NOT NULL is idempotent (no error if the column is already nullable).

ALTER TABLE public.treks ALTER COLUMN operator_name DROP NOT NULL;
ALTER TABLE public.treks ALTER COLUMN operator_contact DROP NOT NULL;

COMMENT ON COLUMN public.treks.operator_name IS
  'DEPRECATED: denormalized operator label for public display. Source of truth is treks.company_id -> companies.name.';
COMMENT ON COLUMN public.treks.operator_contact IS
  'DEPRECATED: denormalized operator contact for public display. Source of truth is treks.company_id -> companies.';
