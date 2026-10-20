-- 0001 · Identity, roles, and geography
-- Supabase / PostgreSQL. Arabic-first marketplace for Egypt.
-- Scope: Phase 0 foundation only. No bookings, no payments, no reviews yet.

create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- ─── Roles ────────────────────────────────────────────────────────────────
-- A single account may hold several roles (someone can book and also list a venue).
create type account_role as enum ('customer', 'provider', 'admin');

-- ─── Profiles ─────────────────────────────────────────────────────────────
-- Mirrors auth.users. Supabase Auth owns credentials; this owns app data.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  locale      text not null default 'ar-EG',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- Soft signal that the human behind the account is reachable. OTP lives in Auth.
  phone_verified boolean not null default false,
  constraint profiles_name_length check (full_name is null or char_length(full_name) between 2 and 120)
);

create unique index profiles_phone_key on public.profiles (phone) where phone is not null;

create table public.account_roles (
  account_id uuid not null references public.profiles (id) on delete cascade,
  role       account_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles (id),
  primary key (account_id, role)
);

create index account_roles_role_idx on public.account_roles (role);

-- ─── Geography ────────────────────────────────────────────────────────────
-- Two levels today, extensible to more without a schema change.
create table public.governorates (
  id         smallint generated always as identity primary key,
  name_ar    text not null unique,
  name_en    text,
  code       text,
  sort_order smallint not null default 0,
  active     boolean not null default true
);

create table public.areas (
  id            integer generated always as identity primary key,
  governorate_id smallint not null references public.governorates (id) on delete restrict,
  name_ar       text not null,
  name_en       text,
  active        boolean not null default true,
  unique (governorate_id, name_ar)
);

create index areas_governorate_idx on public.areas (governorate_id);

-- ─── Helpers ──────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.account_roles
    where account_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.has_role(wanted account_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.account_roles
    where account_id = auth.uid() and role = wanted
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ─── Signup ────────────────────────────────────────────────────────────────
-- Profile + default role are created server-side when the Auth user is created.
-- No client INSERT path: a profile row can only come from Auth, never from a request.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, phone_verified)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.phone,
    new.phone_confirmed_at is not null
  );
  insert into public.account_roles (account_id, role)
  values (new.id, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ─── Row level security ───────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.account_roles enable row level security;
alter table public.governorates enable row level security;
alter table public.areas enable row level security;

create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy profiles_self_update on public.profiles
  for update using (id = auth.uid());
  -- updated_at is server-managed; role grants are never self-service (see account_roles policies).

-- RLS policies are row-level only; they cannot stop a user from writing a column they
-- should not touch. phone_verified mirrors Auth's own verification, so client updates
-- on it (and on id/timestamps) are revoked at the column level, not the row level.
revoke update on public.profiles from authenticated;
grant update (full_name, phone, avatar_url, locale) on public.profiles to authenticated;

create policy account_roles_self_read on public.account_roles
  for select using (account_id = auth.uid() or public.is_admin());

-- Geography is public reference data: readable by anyone, writable by admins only.
create policy geography_public_read on public.governorates for select using (true);
create policy geography_admin_write on public.governorates
  for all using (public.is_admin()) with check (public.is_admin());

create policy areas_public_read on public.areas for select using (true);
create policy areas_admin_write on public.areas
  for all using (public.is_admin()) with check (public.is_admin());
