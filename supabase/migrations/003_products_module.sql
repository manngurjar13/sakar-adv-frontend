create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(12, 2) not null default 0,
  category text not null default '',
  status text not null default 'draft',
  image text,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (status = 'active' or public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read product files" on storage.objects;
create policy "Public can read product files"
on storage.objects
for select
using (bucket_id = 'products');

drop policy if exists "Admins can manage product files" on storage.objects;
create policy "Admins can manage product files"
on storage.objects
for all
using (bucket_id = 'products' and public.is_admin())
with check (bucket_id = 'products' and public.is_admin());
