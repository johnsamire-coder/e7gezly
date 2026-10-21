// Renders the app to PNG so the brand pass can be reviewed by eye, not by reading code.
// Off by default: pixel output differs between renderers, so these images are never
// committed and never compared in CI.
//   E7_PREVIEW=1 FLUTTER_ROOT=<sdk> flutter test --update-goldens test/preview_capture_test.dart
// Output lands in test/preview/ (gitignored).
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart' show Intl;

import 'package:e7gezly_mobile/core/categories.dart';
import 'package:e7gezly_mobile/core/geography.dart';
import 'package:e7gezly_mobile/data/category_source.dart';
import 'package:e7gezly_mobile/data/governorate_source.dart';
import 'package:e7gezly_mobile/main.dart';
import 'package:e7gezly_mobile/router.dart';

final _capture = Platform.environment['E7_PREVIEW'] == '1';

/// `flutter test` does not register pubspec fonts, so text renders as Ahem boxes
/// unless the capture loads them off disk itself.
Future<void> _loadAppFonts() async {
  // The SDK path comes from FLUTTER_ROOT so this keeps working wherever the toolchain lives.
  final sdk = Platform.environment['FLUTTER_ROOT'];
  const families = <String, List<String>>{
    'Cairo': ['assets/fonts/Cairo-Variable.ttf'],
    'IBM Plex Sans Arabic': [
      'assets/fonts/IBMPlexSansArabic-Regular.ttf',
      'assets/fonts/IBMPlexSansArabic-Medium.ttf',
      'assets/fonts/IBMPlexSansArabic-SemiBold.ttf',
      'assets/fonts/IBMPlexSansArabic-Bold.ttf',
    ],
  };
  for (final entry in families.entries) {
    final loader = FontLoader(entry.key);
    for (final path in entry.value) {
      final bytes = await File(path).readAsBytes();
      loader.addFont(Future.value(bytes.buffer.asByteData()));
    }
    await loader.load();
  }

  if (sdk != null) {
    final iconFont = File('$sdk/bin/cache/artifacts/material_fonts/materialicons-regular.otf');
    if (iconFont.existsSync()) {
      final loader = FontLoader('MaterialIcons');
      final bytes = await iconFont.readAsBytes();
      loader.addFont(Future.value(bytes.buffer.asByteData()));
      await loader.load();
    }
  }
}

void main() {
  setUpAll(() async {
    if (!_capture) return;
    initializeDateFormatting('ar');
    Intl.defaultLocale = 'ar';
    await _loadAppFonts();
  });

  const shots = <String, (Size, String, GoRouter Function())>{
    'home_320': (Size(320, 640), '/', buildRouter),
    'home_452': (Size(452, 800), '/', buildRouter),
    'search_360': (Size(360, 740), '/search?category=sports-venues', buildRouter),
    'search_360_cities': (Size(360, 740), '/search?category=sports-venues', _connectedRouter),
    'placeholder_360': (Size(360, 640), '/booking', buildRouter),
  };

  for (final shot in shots.entries) {
    testWidgets(shot.key, (tester) async {
      final (size, route, routerFactory) = shot.value;
      tester.view.physicalSize = size;
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.reset);

      final router = routerFactory();
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go(route);
      await tester.pumpAndSettle();

      await expectLater(find.byType(MaterialApp), matchesGoldenFile('preview/${shot.key}.png'));
    }, skip: !_capture);
  }
}

/// A build that has a server answer for both lists, so the connected layout —
/// sector grid plus city chips — is reviewable as an image, not only as a test.
GoRouter _connectedRouter() => buildRouter(
  CategoryCatalog(
    const _FakeCategorySource([
      E7Category(
        slug: 'restaurants-cafes',
        nameAr: 'مطاعم وكافيهات',
        blurbAr: 'طاولات وبوفيهات مناسبات',
        icon: Icons.restaurant_outlined,
      ),
      E7Category(
        slug: 'sports-venues',
        nameAr: 'أماكن رياضية',
        blurbAr: 'ملاعب خماسي وباديل',
        icon: Icons.sports_soccer_outlined,
      ),
    ]),
  ),
  GovernorateCatalog(
    const _FakeGovernorateSource([
      E7Governorate(id: 1, nameAr: 'القاهرة'),
      E7Governorate(id: 2, nameAr: 'الجيزة'),
      E7Governorate(id: 3, nameAr: 'الإسكندرية'),
      E7Governorate(id: 4, nameAr: 'القليوبية'),
    ]),
  ),
);

class _FakeCategorySource implements CategorySource {
  const _FakeCategorySource(this.rows);

  final List<E7Category> rows;

  @override
  Future<List<E7Category>> load() async => rows;
}

class _FakeGovernorateSource implements GovernorateSource {
  const _FakeGovernorateSource(this.rows);

  final List<E7Governorate> rows;

  @override
  Future<List<E7Governorate>> load() async => rows;
}
