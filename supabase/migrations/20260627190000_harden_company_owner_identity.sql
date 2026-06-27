-- Migration: Harden company owner identity (TB-015.3)
-- Created at: 2026-06-27 19:00:00
--
-- RULE: one authenticated company user must be linked to AT MOST one company
--   (auth.users.id -> companies.owner_id). owner_id stays NULLABLE on purpose:
--   an admin may create a company first and provision its login later, during
--   which owner_id is legitimately null.
--
-- This migration:
--   1. Detects pre-existing duplicate owner_id values and fails LOUDLY with a
--      clear message (so the index creation doesn't fail cryptically).
--   2. Adds a PARTIAL UNIQUE INDEX on owner_id WHERE owner_id IS NOT NULL, so
--      multiple companies can have a null owner, but a non-null owner is unique.
--
-- Idempotent: the index uses IF NOT EXISTS; the duplicate check is read-only.

-- 1. Guard: refuse to proceed if drifted data already has duplicate owners.
DO $$
DECLARE
  dup_count integer;
BEGIN
  SELECT count(*) INTO dup_count
  FROM (
    SELECT owner_id
    FROM public.companies
    WHERE owner_id IS NOT NULL
    GROUP BY owner_id
    HAVING count(*) > 1
  ) AS dups;

  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'Cannot add unique index: % owner_id value(s) are linked to multiple companies. Resolve these duplicates before applying this migration.',
      dup_count;
  END IF;
END $$;

-- 2. Enforce one-company-per-owner for non-null owners.
CREATE UNIQUE INDEX IF NOT EXISTS companies_owner_id_unique
  ON public.companies (owner_id)
  WHERE owner_id IS NOT NULL;
