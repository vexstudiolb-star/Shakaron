-- Shakaron Admin CMS schema
-- Run in Supabase SQL Editor after creating your project.

-- Categories (Rings, Under 1 Gram, etc.)
create table if not exists public.collection_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  description_en text default '',
  description_ar text default '',
  hero_image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.collection_categories(id) on delete restrict,
  brand_line_en text not null default 'Shakaron',
  brand_line_ar text not null default 'شاكارون',
  name_en text not null,
  name_ar text not null,
  price_label_en text not null default 'Price on request',
  price_label_ar text not null default 'السعر عند الطلب',
  product_image_url text,
  worn_image_url text,
  tags text[] default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_is_active_idx on public.products(is_active);

-- Homepage / site sections (toggle & reorder)
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section_type text not null default 'content',
  title_en text not null,
  title_ar text not null,
  eyebrow_en text default '',
  eyebrow_ar text default '',
  description_en text default '',
  description_ar text default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media library (uploaded to R2)
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  url text not null,
  r2_key text not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_en text default '',
  alt_ar text default '',
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists collection_categories_updated_at on public.collection_categories;
create trigger collection_categories_updated_at
  before update on public.collection_categories
  for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists homepage_sections_updated_at on public.homepage_sections;
create trigger homepage_sections_updated_at
  before update on public.homepage_sections
  for each row execute function public.set_updated_at();

-- RLS: public read for active content; writes via service role in API routes
alter table public.collection_categories enable row level security;
alter table public.products enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.media_assets enable row level security;

create policy "Public read active categories"
  on public.collection_categories for select
  using (is_active = true);

create policy "Public read active products"
  on public.products for select
  using (is_active = true);

create policy "Public read enabled sections"
  on public.homepage_sections for select
  using (is_enabled = true);

create policy "Public read media"
  on public.media_assets for select
  using (true);

-- Seed default homepage sections (match current site)
insert into public.homepage_sections (slug, section_type, title_en, title_ar, eyebrow_en, eyebrow_ar, description_en, description_ar, is_enabled, sort_order)
values
  ('hero', 'hero', 'Where Light Becomes Legacy', 'حيث يصبح النور إرثاً', 'Bespoke Jewellery & Manufactory', 'مجوهرات حصرية ومصنع متخصص', '', '', true, 1),
  ('new-collection', 'collection', 'New Collection', 'مجموعة جديدة', 'Just Arrived', 'وصل حديثاً', 'Explore our latest atelier pieces.', 'اكتشف أحدث قطع ورشتنا.', true, 2),
  ('collections', 'collection', 'Collection', 'المجموعة', 'Curated Selection', 'مختارات مميزة', 'Each collection is conceived in our atelier.', 'كل مجموعة تُبتكر في ورشتنا.', true, 3),
  ('craftsmanship', 'content', 'Craftsmanship', 'الحرفية', 'The Art of Making', 'فن الصناعة', '', '', true, 4),
  ('bespoke', 'content', 'Bespoke by Invitation', 'حسب الطلب', 'Commission', 'طلب خاص', '', '', true, 5),
  ('atelier', 'content', 'The Atelier', 'الورشة', 'South Lebanon · Lebanon', 'جنوب لبنان · لبنان', '', '', true, 6)
on conflict (slug) do nothing;
