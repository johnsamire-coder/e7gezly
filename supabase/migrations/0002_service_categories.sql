-- 0002 · Extensible service category tree
-- The marketplace must grow into new verticals without schema changes, so categories
-- are a closure-free adjacency tree with per-category attribute definitions.

create table public.service_categories (
  id             integer generated always as identity primary key,
  parent_id      integer references public.service_categories (id) on delete cascade,
  slug           text not null unique,
  name_ar        text not null,
  name_en        text,
  description_ar text,
  icon           text,
  -- Ordering the admin can change without a deploy.
  sort_order     smallint not null default 0,
  depth          smallint not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  constraint categories_no_self_parent check (parent_id is null or parent_id <> id)
);

create index categories_parent_idx on public.service_categories (parent_id);
create index categories_active_idx on public.service_categories (active) where active;

-- Depth is derived, never trusted from the client.
create or replace function public.categories_set_depth()
returns trigger
language plpgsql
as $$
declare
  parent_depth smallint;
begin
  if new.parent_id is null then
    new.depth := 0;
  else
    select depth into parent_depth from public.service_categories where id = new.parent_id;
    if parent_depth is null then
      raise exception 'unknown parent category %', new.parent_id;
    end if;
    new.depth := parent_depth + 1;
  end if;
  return new;
end;
$$;

create trigger categories_depth
  before insert or update of parent_id on public.service_categories
  for each row execute function public.categories_set_depth();

-- Guards against reparenting a category underneath one of its own descendants.
create or replace function public.categories_reject_cycle()
returns trigger
language plpgsql
as $$
begin
  if new.parent_id is not null and exists (
    with recursive subtree as (
      select id from public.service_categories where id = new.parent_id
      union all
      select c.id from public.service_categories c join subtree s on c.parent_id = s.id
    )
    select 1 from subtree where id = new.id
  ) then
    raise exception 'cycle detected in category tree at %', new.id;
  end if;
  return new;
end;
$$;

create trigger categories_no_cycle
  before update of parent_id on public.service_categories
  for each row when (old.parent_id is distinct from new.parent_id)
  execute function public.categories_reject_cycle();

-- Free-form attributes a category can require (e.g. "capacity", "court surface").
-- Typed as JSON so a new vertical is configuration, not a migration.
create table public.category_attribute_defs (
  id          integer generated always as identity primary key,
  category_id integer not null references public.service_categories (id) on delete cascade,
  key         text not null,
  label_ar    text not null,
  value_type  text not null default 'text'
              check (value_type in ('text', 'number', 'boolean', 'enum', 'time', 'date_range')),
  options     jsonb,
  required    boolean not null default false,
  sort_order  smallint not null default 0,
  unique (category_id, key)
);

alter table public.service_categories enable row level security;
alter table public.category_attribute_defs enable row level security;

create policy categories_public_read on public.service_categories
  for select using (active or public.is_admin());
create policy categories_admin_write on public.service_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy attrdefs_public_read on public.category_attribute_defs for select using (true);
create policy attrdefs_admin_write on public.category_attribute_defs
  for all using (public.is_admin()) with check (public.is_admin());

comment on table public.service_categories is
  'Adjacency-tree service taxonomy. Root rows are the eight launch verticals; children are sub-services.';
