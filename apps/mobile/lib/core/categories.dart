import 'package:flutter/material.dart';

/// A launch vertical as the customer app shows it. Only taxonomy labels live
/// here — no providers, prices, ratings or availability.
///
/// [builtIn] is the offline fallback, hand-mirrored from
/// `supabase/seed/01_reference_data.sql`. When Supabase is configured the list
/// is read from `service_categories` instead, and any screen showing the
/// fallback has to say that it is showing the fallback.
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

  static const builtIn = <E7Category>[
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

  static E7Category? bySlug(List<E7Category> categories, String? slug) {
    if (slug == null) return null;
    for (final category in categories) {
      if (category.slug == slug) return category;
    }
    return null;
  }

  /// `service_categories.icon` stores a stable key, not a glyph. An unknown key
  /// falls back so a sector added on the server still renders.
  static IconData iconForKey(String? key) => switch (key) {
    'restaurant' => Icons.restaurant_outlined,
    'sports' => Icons.sports_soccer_outlined,
    'beauty' => Icons.face_outlined,
    'health' => Icons.local_hospital_outlined,
    'home' => Icons.handyman_outlined,
    'events' => Icons.celebration_outlined,
    'travel' => Icons.beach_access_outlined,
    _ => Icons.auto_awesome_outlined,
  };
}
