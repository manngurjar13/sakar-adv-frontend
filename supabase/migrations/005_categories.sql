create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('product', 'service', 'advertising', 'event')),
  name text not null,
  slug text not null,
  color_class text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, slug)
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

insert into public.categories (entity_type, name, slug, color_class, sort_order, is_active)
values
  ('product', 'No Parking Boards', 'no parking boards', null, 1, true),
  ('product', 'Roll-Up Banners', 'roll up banners', null, 2, true),
  ('product', 'Promo Tables', 'promo tables', null, 3, true),
  ('product', 'LED Signage', 'led signage', null, 4, true),
  ('product', 'Flex Printing', 'flex printing', null, 5, true),
  ('product', 'Glow Signs', 'glow signs', null, 6, true),
  ('service', 'Vehicle Branding', 'vehicle branding', null, 1, true),
  ('service', 'Auto Rickshaw', 'auto rickshaw', null, 2, true),
  ('service', 'E-Rickshaw', 'e-rickshaw', null, 3, true),
  ('service', 'Bus Advertising', 'bus advertising', null, 4, true),
  ('service', 'Mobile Van', 'mobile van', null, 5, true),
  ('service', 'Wall Painting', 'wall painting', null, 6, true),
  ('advertising', 'Outdoor Hoardings', 'outdoor hoardings', null, 1, true),
  ('advertising', 'Billboard Advertising', 'billboard advertising', null, 2, true),
  ('advertising', 'Festival Banners', 'festival banners', null, 3, true),
  ('advertising', 'Field Activation', 'field activation', null, 4, true),
  ('advertising', 'BTL Campaigns', 'btl campaigns', null, 5, true),
  ('advertising', 'Digital Advertising', 'digital advertising', null, 6, true),
  ('advertising', 'Print Advertising', 'print advertising', null, 7, true),
  ('event', 'Corporate Events', 'corporate', 'from-blue-500 to-blue-600', 1, true),
  ('event', 'Social Events', 'social', 'from-orange-500 to-orange-600', 2, true),
  ('event', 'Birthday Decor', 'birthday', 'from-purple-500 to-purple-600', 3, true),
  ('event', 'Wedding Decor', 'wedding', 'from-pink-500 to-pink-600', 4, true),
  ('event', 'Office Decor', 'office', 'from-indigo-500 to-indigo-600', 5, true),
  ('event', 'ATL Activities', 'atl', 'from-green-500 to-green-600', 6, true),
  ('event', 'BTL Activities', 'btl', 'from-red-500 to-red-600', 7, true),
  ('event', 'Lunch Event', 'lunch', 'from-yellow-500 to-yellow-600', 8, true),
  ('event', 'Conference', 'conference', 'from-cyan-500 to-cyan-600', 9, true),
  ('event', 'Workshop', 'workshop', 'from-emerald-500 to-emerald-600', 10, true),
  ('event', 'Seminar', 'seminar', 'from-sky-500 to-sky-600', 11, true),
  ('event', 'Festival', 'festival', 'from-fuchsia-500 to-fuchsia-600', 12, true),
  ('event', 'Cultural Event', 'cultural', 'from-violet-500 to-violet-600', 13, true),
  ('event', 'Normal Event', 'normal', 'from-slate-500 to-slate-600', 14, true)
on conflict (entity_type, slug) do nothing;
