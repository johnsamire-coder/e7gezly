import 'package:flutter/material.dart';

import '../core/tokens.dart';
import 'e7_card.dart';

/// Says out loud that no real listings can be shown yet.
/// Wording matters: this is *not* "لا توجد نتائج" — we do not know that,
/// we know the backend is not connected.
/// [onRetry] turns it into a fetch-failure card; the wording stays honest either
/// way, because neither state is allowed to look like data.
class DataOfflineBanner extends StatelessWidget {
  const DataOfflineBanner({
    super.key,
    this.title = 'لسه ما فيهوش قوائم حقيقية',
    this.message,
    this.onRetry,
  });

  final String title;
  final String? message;
  final VoidCallback? onRetry;

  static const _notConnectedMessage =
      'التطبيق لسه ما اتربطش بمشروع Supabase، فمفيش مصدر بيانات نعرض منه. '
      'مش معناه إن مفيش مقدمي خدمة — معناه إن الحالة دي لسه متعينةش.';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return E7Card(
      color: E7Color.sand,
      padding: const EdgeInsets.all(E7Space.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            onRetry == null ? Icons.info_outline_rounded : Icons.wifi_off_rounded,
            color: E7Color.warningFg,
          ),
          const SizedBox(width: E7Space.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.textTheme.titleMedium),
                const SizedBox(height: E7Space.xs),
                Text(
                  message ?? _notConnectedMessage,
                  style: theme.textTheme.bodySmall?.copyWith(color: E7Color.ink500),
                ),
                if (onRetry != null) ...[
                  const SizedBox(height: E7Space.sm),
                  Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: TextButton(onPressed: onRetry, child: const Text('حاول تاني')),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
