-- Wipe CMS content so you can rebuild from Admin.
-- Run in Supabase → SQL Editor.
-- Does NOT delete Auth users.

-- Order matters: products reference categories
truncate table public.media_assets restart identity cascade;
truncate table public.products restart identity cascade;
truncate table public.collection_categories restart identity cascade;
truncate table public.homepage_sections restart identity cascade;

-- Re-seed default homepage sections (enabled)
insert into public.homepage_sections (
  slug, section_type, title_en, title_ar, eyebrow_en, eyebrow_ar,
  description_en, description_ar, is_enabled, sort_order
)
values
  ('hero', 'hero', 'Where Light Becomes Legacy', 'حيث يصبح النور إرثاً', 'Bespoke Jewellery & Manufactory', 'مجوهرات حصرية ومصنع متخصص', '', '', true, 1),
  ('new-collection', 'collection', 'New Collection', 'مجموعة جديدة', 'Just Arrived', 'وصل حديثاً', 'Explore our latest atelier pieces.', 'اكتشف أحدث قطع ورشتنا.', true, 2),
  ('collections', 'collection', 'Collection', 'المجموعة', 'Curated Selection', 'مختارات مميزة', 'Each collection is conceived in our atelier.', 'كل مجموعة تُبتكر في ورشتنا.', true, 3),
  ('craftsmanship', 'content', 'Craftsmanship', 'الحرفية', 'The Art of Making', 'فن الصناعة', '', '', true, 4),
  ('bespoke', 'content', 'Bespoke by Invitation', 'حسب الطلب', 'Commission', 'طلب خاص', '', '', true, 5),
  ('atelier', 'content', 'The Atelier', 'الورشة', 'South Lebanon · Lebanon', 'جنوب لبنان · لبنان', '', '', true, 6)
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  eyebrow_en = excluded.eyebrow_en,
  eyebrow_ar = excluded.eyebrow_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  is_enabled = excluded.is_enabled,
  sort_order = excluded.sort_order;

-- Optional starter categories (edit/delete in Admin after)
insert into public.collection_categories (
  slug, name_en, name_ar, description_en, description_ar, sort_order, is_active
)
values
  ('rings', 'Rings', 'خواتم', '', '', 1, true),
  ('bracelets', 'Bracelets', 'أساور', '', '', 2, true),
  ('necklaces', 'Necklaces', 'قلائد', '', '', 3, true),
  ('full-set', 'Full Set', 'طقم كامل', '', '', 4, true),
  ('kids', 'Kids', 'أطفال', '', '', 5, true),
  ('under-1-gram', 'Under 1 Gram', 'أقل من غرام', '', '', 6, true)
on conflict (slug) do nothing;
