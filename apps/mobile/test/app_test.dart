import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
// `show Intl` only: package:intl also exports a TextDirection that would clash
// with dart:ui's TextDirection used in the RTL assertion below.
import 'package:intl/intl.dart' show Intl;

import 'package:e7gezly_mobile/core/format.dart';
import 'package:e7gezly_mobile/main.dart';
import 'package:e7gezly_mobile/router.dart';

void main() {
  setUpAll(() {
    initializeDateFormatting('ar');
    Intl.defaultLocale = 'ar';
  });

  group('formatting', () {
    test('EGP uses Latin digits and the Egyptian pound unit', () {
      final formatted = E7Format.egp(1200);
      expect(formatted, contains('1,200'));
      expect(formatted, contains('ج.م'));
      expect(formatted, isNot(contains('١')));
    });

    test('dates use Arabic month names with Latin digits', () {
      final formatted = E7Format.date(DateTime(2026, 10, 20));
      expect(formatted, contains('أكتوبر'));
      expect(formatted, contains('2026'));
    });
  });

  testWidgets('home renders the Arabic RTL shell', (tester) async {
    await tester.pumpWidget(E7gezlyApp());

    expect(Directionality.of(tester.element(find.byType(Scaffold).first)), TextDirection.rtl);
    expect(find.text('احجزلي'), findsOneWidget);
    expect(find.text('عايز تحجز إيه؟'), findsOneWidget);
    // The app must never imply real listings exist while no backend is connected.
    expect(find.text('لسه ما فيهوش قوائم حقيقية'), findsOneWidget);
  });

  testWidgets('category card navigates to search and echoes the filter', (tester) async {
    await tester.pumpWidget(E7gezlyApp());

    final chip = find.text('أماكن رياضية');
    await tester.ensureVisible(chip);
    await tester.tap(chip);
    await tester.pumpAndSettle();

    expect(find.text('نتائج البحث'), findsOneWidget);
    expect(find.textContaining('أماكن رياضية'), findsWidgets);
  });

  testWidgets('search field submit reaches the results route', (tester) async {
    await tester.pumpWidget(E7gezlyApp());

    await tester.enterText(find.byType(TextField), 'قاعة أفراح');
    await tester.tap(find.text('دوّر'));
    await tester.pumpAndSettle();

    expect(find.text('«قاعة أفراح»'), findsOneWidget);
  });

  testWidgets('placeholder routes state that the screen is not built', (tester) async {
    final router = buildRouter();
    await tester.pumpWidget(E7gezlyApp(router: router));
    router.go('/booking');
    await tester.pumpAndSettle();

    expect(find.text('طلب حجز'), findsOneWidget);
    expect(find.text('الشاشة دي لسه ما اتبنتش'), findsOneWidget);
  });

  testWidgets('no layout overflow at a 320dp phone', (tester) async {
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(E7gezlyApp());
    expect(tester.takeException(), isNull);
  });
}
