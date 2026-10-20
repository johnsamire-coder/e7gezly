// Renders the app to PNG so the brand pass can be reviewed by eye, not by reading code.
// Off by default: pixel output differs between renderers, so these images are never
// committed and never compared in CI.
//   E7_PREVIEW=1 FLUTTER_ROOT=<sdk> flutter test --update-goldens test/preview_capture_test.dart
// Output lands in test/preview/ (gitignored).
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart' show Intl;

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

  const shots = <String, (Size, String)>{
    'home_320': (Size(320, 640), '/'),
    'home_452': (Size(452, 800), '/'),
    'search_360': (Size(360, 740), '/search?category=sports-venues'),
    'placeholder_360': (Size(360, 640), '/booking'),
  };

  for (final shot in shots.entries) {
    testWidgets(shot.key, (tester) async {
      final (size, route) = shot.value;
      tester.view.physicalSize = size;
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.reset);

      final router = buildRouter();
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go(route);
      await tester.pumpAndSettle();

      await expectLater(find.byType(MaterialApp), matchesGoldenFile('preview/${shot.key}.png'));
    }, skip: !_capture);
  }
}
