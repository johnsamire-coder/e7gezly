-- 0003 · Permission hardening
-- Three gaps written down while auditing the live project on 2026-10-21. None of them
-- adds a table or a column, so apps/web/src/lib/database.types.ts stays as it is and
-- tools/check-schema-drift.ps1 keeps passing.

-- ─── 1) Stopped reference rows stop reaching customers ──────────────────────
-- service_categories already hides inactive rows from non-admins. Geography and the
-- attribute definitions did not: the mobile app filters `active` in its query, which is
-- a courtesy and not a guarantee — anyone holding the public key could still read a
-- governorate, an area or an attribute the admin had switched off.
--
-- The checks go through functions rather than subqueries because a subquery inside a
-- policy is evaluated under the reader's own row level security, which is how policy
-- recursion bugs are born.

create or replace function public.governorate_is_active(wanted smallint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.governorates where id = wanted and active
  );
$$;

create or replace function public.category_is_active(wanted integer)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.service_categories where id = wanted and active
  );
$$;

drop policy if exists geography_public_read on public.governorates;
create policy geography_public_read on public.governorates
  for select using (active or public.is_admin());

drop policy if exists areas_public_read on public.areas;
create policy areas_public_read on public.areas
  for select using ((active and public.governorate_is_active(governorate_id)) or public.is_admin());

drop policy if exists attrdefs_public_read on public.category_attribute_defs;
create policy attrdefs_public_read on public.category_attribute_defs
  for select using (public.category_is_active(category_id) or public.is_admin());

-- ─── 2) Privileges that RLS should not be alone in holding ──────────────────
-- Row level security is the answer to "which rows", and it is only consulted after the
-- role has been allowed to touch the table at all. These two tables have no customer-
-- facing rows for an anonymous request, and no client has any business writing roles:
-- granting the shape as well as the rows costs nothing and survives someone adding a
-- permissive policy later.

revoke all on public.profiles from anon;
revoke all on public.account_roles from anon;
revoke insert, update, delete on public.account_roles from authenticated;

-- account_roles stays readable for authenticated: the portal reads its own roles to
-- decide what to show, and account_roles_self_read limits which rows come back.

-- ─── 3) phone_verified cannot survive a phone edit ──────────────────────────
-- The column mirrors Auth's own verification, and update on it is already revoked at
-- the column level. What that leaves open is the stale claim: a user who edits their
-- phone keeps phone_verified = true from the number they verified before. Until ٢-٦
-- re-verifies through a message provider, an unverified number must not be able to
-- wear a verified badge.
--
-- This fires for admin edits too, on purpose: the flag is Auth's statement about a
-- number, not a field to be set.

create or replace function public.reset_phone_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.phone is distinct from old.phone then
    new.phone_verified := false;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_reset_phone_verification on public.profiles;
create trigger profiles_reset_phone_verification
  before update on public.profiles
  for each row execute function public.reset_phone_verification();

comment on column public.profiles.phone_verified is
  'Set from Auth at signup and cleared whenever the phone changes. Only a verification '
  'flow (Phase 2 ٢-٦, pending the message-provider decision) may set it true again.';
