import 'package:flutter/material.dart';

import '../core/tokens.dart';
import '../data/category_source.dart';
import 'data_offline_banner.dart';

/// The states that are not "here are the sectors", worded so a customer can
/// tell the three apart: nothing to show yet, the server did not answer, and
/// the server answered with an empty list.
abstract final class CategoryCatalogNotice {
  /// Null when there are sectors to draw.
  static Widget? from(CategoryCatalog catalog) {
    if (catalog.isLoading) return const _LoadingRow();
    if (catalog.hasFailed) {
      return DataOfflineBanner(
        title: 'القطاعات مجاتش من السيرفر',
        message:
            'الاتصال بمشروع Supabase فشل — يمكن يكون الإنترنت أو المفتاح. '
            'مش معناه إن مفيش قطاعات، ومعناه إن القايمة اللي كانت هنا مش مضمونة.',
        onRetry: catalog.retry,
      );
    }
    if (catalog.isBuiltInOnly || catalog.categories.isNotEmpty) return null;
    return const DataOfflineBanner(
      title: 'السيرفر ما فيهوش قطاعات منشورة',
      message:
          'الاتصال تمام، بس جدول service_categories ما رجّعش أي قسم نشط. '
          'لو إنت بتجهّز المشروع، ضيف القطاعات من لوحة الإدارة.',
    );
  }
}

class _LoadingRow extends StatelessWidget {
  const _LoadingRow();

  @override
  Widget build(BuildContext context) => const Padding(
    padding: EdgeInsets.symmetric(vertical: E7Space.lg),
    child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
  );
}
