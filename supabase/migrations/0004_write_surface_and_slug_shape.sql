-- 0004 · Write surface and slug shape
-- Measured on the hosted project with has_table_privilege() on 2026-10-21: RLS is on for
-- every table, but anon still held INSERT/UPDATE/DELETE on all four public tables.
-- Nothing here adds a table or a column, so database.types.ts and
-- tools/check-schema-drift.ps1 stay as they are.

-- ─── 1) Anonymous requests stop holding write privileges at all ───────────────
-- The *_admin_write policies already rejected them, so today this changes no outcome.
-- It closes the shape rather than the row: a policy added later by someone who forgets
-- that anon can write must not silently become a public write endpoint. The revoke is
-- followed by an explicit SELECT grant so "anon may read this table" is written down
-- instead of being inherited from a default nobody remembers.
--
-- authenticated keeps its write privileges on purpose: the admin signs in as that role,
-- and it is public.is_admin() inside the policies that decides who actually writes.

revoke all on public.governorates from anon;
revoke all on public.areas from anon;
revoke all on public.service_categories from anon;
revoke all on public.category_attribute_defs from anon;

grant select on public.governorates to anon;
grant select on public.areas to anon;
grant select on public.service_categories to anon;
grant select on public.category_attribute_defs to anon;

-- ─── 2) A category slug is a URL segment, so it has to look like one ──────────
-- slug is the only identifier the portal lets the admin type by hand, and it was only
-- ever checked for uniqueness. An Arabic or uppercase value saved here is invisible in
-- the admin screen and breaks every link built from it later. The eight seeded slugs
-- already satisfy this shape (restaurants-cafes, sports-venues, beauty, healthcare,
-- home-services, events, travel, other), so the constraint validates existing rows.
-- lower(slug) is written separately because in a UTF-8 collation [a-z] can match capital
-- letters too, and a shape rule that quietly allows uppercase is not a shape rule.

alter table public.service_categories
  add constraint categories_slug_shape check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

comment on constraint categories_slug_shape on public.service_categories is
  'Lowercase latin letters, digits and single hyphens. This is a URL segment.';

-- ─── 3) Stopped sectors: what is deferred, and why it is not done here ─────────
-- 0003 made an area invisible when its governorate is switched off. The same chain rule
-- is not applied to child categories yet, because nothing reads them: the mobile app
-- asks for roots only (data/category_source.dart filters parent_id is null) and the
-- portal is admin-side, where every row is readable by design. This belongs with the
-- first query that reads children - Phase 3 listings - and writing a policy for a reader
-- that does not exist yet only hides the fact that the reader was never decided.
