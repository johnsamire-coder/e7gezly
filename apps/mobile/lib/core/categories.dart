import 'package:flutter/material.dart';

/// The eight launch verticals, mirroring `supabase/seed/01_reference_data.sql`.
/// Only taxonomy labels live here — no providers, prices, ratings or
/// availability. Once the backend is reachable this list is fetched from
/// `service_categories` instead of being carried in the app.
class E7Category {
  const E7Category({
    required this.slug,
    required this.nameAr,
    required this.blurbAr,
    required this.icon,
  });

  final String slug;
  final String nameAr;
  final String blurbAr;
  final IconData icon;

  static const all = <E7Category>[
    E7Category(
      slug: 'restaurants-cafes',
      nameAr: 'مطاعم وكافيهات',
      blurbAr: 'طاولات، بوفيهات مناسبات، وقعدات عائلية',
      icon: Icons.restaurant_outlined,
    ),
    E7Category(
      slug: 'sports-venues',
      nameAr: 'أماكن رياضية',
      blurbAr: 'ملاعب خماسي، باديل، أندية وصالات تدريب',
      icon: Icons.sports_soccer_outlined,
    ),
    E7Category(
      slug: 'beauty',
      nameAr: 'تجميل وعناية',
      blurbAr: 'صالونات حريمي ورجالي، سبا، وماكيير مناسبات',
      icon: Icons.face_outlined,
    ),
    E7Category(
      slug: 'healthcare',
      nameAr: 'عيادات وصحة',
      blurbAr: 'مواعيد كشف، أسنان، ومعامل تحاليل',
      icon: Icons.local_hospital_outlined,
    ),
    E7Category(
      slug: 'home-services',
      nameAr: 'خدمات المنزل',
      blurbAr: 'سباكة، كهربا، نظافة، وتكييفات',
      icon: Icons.handyman_outlined,
    ),
    E7Category(
      slug: 'events',
      nameAr: 'مناسبات وأفراح',
      blurbAr: 'قاعات، تصوير، تنسيق، وضيافة',
      icon: Icons.celebration_outlined,
    ),
    E7Category(
      slug: 'travel',
      nameAr: 'سفر ومصاطيف',
      blurbAr: 'إقامة، نقل سياحي، وبرامج يومية',
      icon: Icons.beach_access_outlined,
    ),
    E7Category(
      slug: 'other',
      nameAr: 'خدمات تانية',
      blurbAr: 'قاعات عمل، تدريب، وتأجير معدات',
      icon: Icons.auto_awesome_outlined,
    ),
  ];

  static E7Category? bySlug(String? slug) {
    if (slug == null) return null;
    for (final category in all) {
      if (category.slug == slug) return category;
    }
    return null;
  }
}
