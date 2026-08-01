create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  service_name jsonb not null default '{}'::jsonb,
  description text not null default '',
  image text,
  feature_heading jsonb not null default '{}'::jsonb,
  feature_description text not null default '',
  feature jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'normal',
  date date,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_banners (
  id uuid primary key default gen_random_uuid(),
  banner_text text not null,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.upcoming_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  location text not null default '',
  description text not null default '',
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  image text,
  status text not null default 'published',
  client text,
  year text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company text,
  description text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null default '',
  message text not null,
  company text,
  budget text,
  services jsonb not null default '[]'::jsonb,
  status text not null default 'new',
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_config (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique,
  address jsonb not null default '{"street":"","area":"","city":"","state":"","pincode":""}'::jsonb,
  emails jsonb not null default '[]'::jsonb,
  phone_numbers jsonb not null default '[]'::jsonb,
  whatsapp_numbers jsonb not null default '[]'::jsonb,
  social_media jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.contact_config (singleton)
select true
where not exists (
  select 1
  from public.contact_config
  where singleton = true
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists event_banners_set_updated_at on public.event_banners;
create trigger event_banners_set_updated_at
before update on public.event_banners
for each row execute function public.set_updated_at();

drop trigger if exists upcoming_events_set_updated_at on public.upcoming_events;
create trigger upcoming_events_set_updated_at
before update on public.upcoming_events
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at
before update on public.portfolio_items
for each row execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists contact_config_set_updated_at on public.contact_config;
create trigger contact_config_set_updated_at
before update on public.contact_config
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.services enable row level security;
alter table public.events enable row level security;
alter table public.event_banners enable row level security;
alter table public.upcoming_events enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_config enable row level security;

drop policy if exists "Admins can view admin users" on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users
for select
using (public.is_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
on public.services
for select
using (true);

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
on public.services
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events
for select
using (true);

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events"
on public.events
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read event banners" on public.event_banners;
create policy "Public can read event banners"
on public.event_banners
for select
using (true);

drop policy if exists "Admins can manage event banners" on public.event_banners;
create policy "Admins can manage event banners"
on public.event_banners
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read upcoming events" on public.upcoming_events;
create policy "Public can read upcoming events"
on public.upcoming_events
for select
using (true);

drop policy if exists "Admins can manage upcoming events" on public.upcoming_events;
create policy "Admins can manage upcoming events"
on public.upcoming_events
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published portfolio" on public.portfolio_items;
create policy "Public can read published portfolio"
on public.portfolio_items
for select
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage portfolio" on public.portfolio_items;
create policy "Admins can manage portfolio"
on public.portfolio_items
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
on public.testimonials
for select
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can submit contacts" on public.contacts;
create policy "Public can submit contacts"
on public.contacts
for insert
with check (true);

drop policy if exists "Admins can read contacts" on public.contacts;
create policy "Admins can read contacts"
on public.contacts
for select
using (public.is_admin());

drop policy if exists "Admins can update contacts" on public.contacts;
create policy "Admins can update contacts"
on public.contacts
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete contacts" on public.contacts;
create policy "Admins can delete contacts"
on public.contacts
for delete
using (public.is_admin());

drop policy if exists "Public can read contact config" on public.contact_config;
create policy "Public can read contact config"
on public.contact_config
for select
using (true);

drop policy if exists "Admins can manage contact config" on public.contact_config;
create policy "Admins can manage contact config"
on public.contact_config
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('services', 'services', true),
  ('events', 'events', true),
  ('event-banners', 'event-banners', true),
  ('portfolio', 'portfolio', true),
  ('upcoming-events', 'upcoming-events', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read service files" on storage.objects;
create policy "Public can read service files"
on storage.objects
for select
using (bucket_id = 'services');

drop policy if exists "Admins can manage service files" on storage.objects;
create policy "Admins can manage service files"
on storage.objects
for all
using (bucket_id = 'services' and public.is_admin())
with check (bucket_id = 'services' and public.is_admin());

drop policy if exists "Public can read event files" on storage.objects;
create policy "Public can read event files"
on storage.objects
for select
using (bucket_id = 'events');

drop policy if exists "Admins can manage event files" on storage.objects;
create policy "Admins can manage event files"
on storage.objects
for all
using (bucket_id = 'events' and public.is_admin())
with check (bucket_id = 'events' and public.is_admin());

drop policy if exists "Public can read event banner files" on storage.objects;
create policy "Public can read event banner files"
on storage.objects
for select
using (bucket_id = 'event-banners');

drop policy if exists "Admins can manage event banner files" on storage.objects;
create policy "Admins can manage event banner files"
on storage.objects
for all
using (bucket_id = 'event-banners' and public.is_admin())
with check (bucket_id = 'event-banners' and public.is_admin());

drop policy if exists "Public can read portfolio files" on storage.objects;
create policy "Public can read portfolio files"
on storage.objects
for select
using (bucket_id = 'portfolio');

drop policy if exists "Admins can manage portfolio files" on storage.objects;
create policy "Admins can manage portfolio files"
on storage.objects
for all
using (bucket_id = 'portfolio' and public.is_admin())
with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Public can read upcoming event files" on storage.objects;
create policy "Public can read upcoming event files"
on storage.objects
for select
using (bucket_id = 'upcoming-events');

drop policy if exists "Admins can manage upcoming event files" on storage.objects;
create policy "Admins can manage upcoming event files"
on storage.objects
for all
using (bucket_id = 'upcoming-events' and public.is_admin())
with check (bucket_id = 'upcoming-events' and public.is_admin());

comment on table public.admin_users is 'Add one row per Supabase auth user who should access the admin panel.';
