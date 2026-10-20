import 'package:flutter/material.dart';

import '../core/tokens.dart';

/// The one card surface in the app: token radius, token hairline, token shadow.
///
/// Plain `Card` cannot express the shadow the tokens describe (Material derives its
/// blur from an elevation number), so cards are built here instead.
class E7Card extends StatelessWidget {
  const E7Card({super.key, required this.child, this.color, this.padding, this.raised = false});

  final Widget child;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final bool raised;

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(E7Radius.card);

    return Container(
      decoration: BoxDecoration(
        color: color ?? E7Color.card,
        borderRadius: radius,
        border: Border.all(color: E7Color.line),
        boxShadow: [if (raised) E7Elevation.raisedShadow else E7Elevation.cardShadow],
      ),
      clipBehavior: Clip.antiAlias,
      child: padding == null ? child : Padding(padding: padding!, child: child),
    );
  }
}
