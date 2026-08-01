create table if not exists public.advertising (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  advertising_name jsonb not null default '{}'::jsonb,
  description text not null default '',
  image text,
  feature_heading jsonb not null default '{}'::jsonb,
  feature_description text not null default '',
  feature jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists advertising_set_updated_at on public.advertising;
create trigger advertising_set_updated_at
before update on public.advertising
for each row execute function public.set_updated_at();

alter table public.advertising enable row level security;

drop policy if exists "Public can read advertising" on public.advertising;
create policy "Public can read advertising"
on public.advertising
for select
using (true);

drop policy if exists "Admins can manage advertising" on public.advertising;
create policy "Admins can manage advertising"
on public.advertising
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('advertising', 'advertising', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read advertising files" on storage.objects;
create policy "Public can read advertising files"
on storage.objects
for select
using (bucket_id = 'advertising');

drop policy if exists "Admins can manage advertising files" on storage.objects;
create policy "Admins can manage advertising files"
on storage.objects
for all
using (bucket_id = 'advertising' and public.is_admin())
with check (bucket_id = 'advertising' and public.is_admin());
