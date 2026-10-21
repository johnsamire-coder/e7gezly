import 'package:flutter/material.dart';

import '../core/tokens.dart';
import '../data/governorate_source.dart';
import 'data_offline_banner.dart';

/// The states that are not "here are the governorates", worded so a customer
/// can tell them apart: nothing connected, the server did not answer, the
/// server answered with an empty list.
///
/// There is no fourth state on purpose: geography has no list carried inside
/// the app, so it can never quietly show fallback labels as if they were the
/// admin's rows.
abstract final class GovernorateCatalogNotice {
  /// Null when there are governorates to draw.
  static Widget? from(GovernorateCatalog catalog) {
    if (!catalog.isConfigured) {
      return const DataOfflineBanner(
        title: 'مفيش محافظات معروضة من سيرفر',
        message:
            'التطبيق لسه ما اتربطش بمشروع Supabase، فمالوش مصدر قايمة محافظات '
            'نعرض منه. مش معناه إن مفيش محافظات — معناه إن الحالة دي لسه متعينةش.',
      );
    }
    if (catalog.isLoading) return const _LoadingRow();
    if (catalog.hasFailed) {
      return DataOfflineBanner(
        title: 'المحافظات مجاتش من السيرفر',
        message:
            'الاتصال بمشروع Supabase فشل — يمكن يكون الإنترنت أو المفتاح. '
            'مش معناه إن مفيش محافظات، ومعناه إن القايمة اللي كانت هنا مش مضمونة.',
        onRetry: catalog.retry,
      );
    }
    if (catalog.governorates.isNotEmpty) return null;
    return const DataOfflineBanner(
      title: 'السيرفر ما فيهوش محافظات منشورة',
      message:
          'الاتصال تمام، بس جدول governorates ما رجّعش أي محافظة نشطة. '
          'لو إنت بتجهّز المشروع، ضيف المحافظات من لوحة الإدارة.',
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
