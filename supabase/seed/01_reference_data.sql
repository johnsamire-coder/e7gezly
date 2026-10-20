-- Reference data seed: real Egyptian geography + the launch taxonomy.
-- This is factual reference data, NOT demo listings. Safe to run in any environment.
-- Provider names, prices, ratings and availability deliberately do not appear here.

insert into public.governorates (name_ar, name_en, code, sort_order) values
  ('القاهرة', 'Cairo', 'C', 1),
  ('الجيزة', 'Giza', 'GZ', 2),
  ('الإسكندرية', 'Alexandria', 'ALX', 3),
  ('القليوبية', 'Qalyubia', 'KB', 4),
  ('الدقهلية', 'Dakahlia', 'DK', 5),
  ('الشرقية', 'Sharqia', 'SHR', 6),
  ('الغربية', 'Gharbia', 'G', 7),
  ('المنوفية', 'Menofia', 'MNF', 8),
  ('البحيرة', 'Beheira', 'BH', 9),
  ('بورسعيد', 'Port Said', 'PS', 10),
  ('السويس', 'Suez', 'SZ', 11),
  ('الإسماعيلية', 'Ismailia', 'IS', 12),
  ('دمياط', 'Damietta', 'DT', 13),
  ('كفر الشيخ', 'Kafr El Sheikh', 'KS', 14),
  ('الفيوم', 'Fayoum', 'FYM', 15),
  ('بني سويف', 'Beni Suef', 'BA', 16),
  ('المنيا', 'Minya', 'MN', 17),
  ('أسيوط', 'Assiut', 'AST', 18),
  ('سوهاج', 'Sohag', 'SHG', 19),
  ('قنا', 'Qena', 'QA', 20),
  ('الأقصر', 'Luxor', 'LX', 21),
  ('أسوان', 'Aswan', 'ASW', 22),
  ('مطروح', 'Matrouh', 'MT', 23),
  ('البحر الأحمر', 'Red Sea', 'BAH', 24),
  ('جنوب سيناء', 'South Sinai', 'JS', 25),
  ('شمال سيناء', 'North Sinai', 'NS', 26),
  ('الوادي الجديد', 'New Valley', 'WAD', 27)
on conflict (name_ar) do nothing;

-- The eight launch verticals. Children are added by admins later; nothing here is hardcoded in the app.
insert into public.service_categories (slug, name_ar, description_ar, icon, sort_order) values
  ('restaurants-cafes', 'مطاعم وكافيهات', 'طاولات، بوفيهات مناسبات، وقعدات عائلية', 'restaurant', 1),
  ('sports-venues', 'أماكن رياضية', 'ملاعب خماسي، باديل، أندية وصالات تدريب', 'sports', 2),
  ('beauty', 'تجميل وعناية', 'صالونات حريمي ورجالي، سبا، وماكيير مناسبات', 'beauty', 3),
  ('healthcare', 'عيادات وصحة', 'مواعيد كشف، أسنان، ومعامل تحاليل', 'health', 4),
  ('home-services', 'خدمات المنزل', 'سباكة، كهربا، نظافة، وتكييفات', 'home', 5),
  ('events', 'مناسبات وأفراح', 'قاعات، تصوير، تنسيق، وضيافة', 'events', 6),
  ('travel', 'سفر ومصاطيف', 'إقامة، نقل سياحي، وبرامج يومية', 'travel', 7),
  ('other', 'خدمات تانية', 'قاعات عمل، تدريب، وتأجير معدات', 'sparkle', 8)
on conflict (slug) do nothing;
