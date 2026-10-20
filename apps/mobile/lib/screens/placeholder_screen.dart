import 'package:flutter/material.dart';

import '../core/tokens.dart';

/// Honest stand-in for a screen whose data or logic does not exist yet.
/// It never pretends to have content: no skeleton rows, no fake numbers.
class PlaceholderScreen extends StatelessWidget {
  const PlaceholderScreen({
    super.key,
    required this.title,
    required this.reason,
    this.phase = 'المرحلة ١',
  });

  final String title;
  final String reason;
  final String phase;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(E7Space.md),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(E7Space.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.hourglass_bottom_rounded, color: E7Color.ink400),
                        const SizedBox(width: E7Space.sm),
                        Text(phase, style: theme.textTheme.labelLarge),
                      ],
                    ),
                    const SizedBox(height: E7Space.sm),
                    Text('الشاشة دي لسه ما اتبنتش', style: theme.textTheme.titleLarge),
                    const SizedBox(height: E7Space.sm),
                    Text(reason, style: theme.textTheme.bodyMedium),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
