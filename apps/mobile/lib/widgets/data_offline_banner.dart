import 'package:flutter/material.dart';

import '../core/tokens.dart';

/// Says out loud that no real listings can be shown yet.
/// Wording matters: this is *not* "لا توجد نتائج" — we do not know that,
/// we know the backend is not connected.
class DataOfflineBanner extends StatelessWidget {
  const DataOfflineBanner({super.key, this.title = 'لسه ما فيهوش قوائم حقيقية'});

  final String title;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      color: E7Color.sand,
      child: Padding(
        padding: const EdgeInsets.all(E7Space.md),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.info_outline_rounded, color: E7Color.warningFg),
            const SizedBox(width: E7Space.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.titleMedium),
                  const SizedBox(height: E7Space.xs),
                  Text(
                    'التطبيق لسه ما اتربطش بمشروع Supabase، فمفيش مصدر بيانات نعرض منه. '
                    'مش معناه إن مفيش مقدمي خدمة — معناه إن الحالة دي لسه متعينةش.',
                    style: theme.textTheme.bodySmall?.copyWith(color: E7Color.ink500),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
