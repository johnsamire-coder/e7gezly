import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';
// `show Intl` only: package:intl also exports a TextDirection that would clash
// with dart:ui's TextDirection used in the RTL assertion below.
import 'package:intl/intl.dart' show Intl;

import 'package:e7gezly_mobile/core/categories.dart';
import 'package:e7gezly_mobile/core/format.dart';
import 'package:e7gezly_mobile/core/geography.dart';
import 'package:e7gezly_mobile/data/category_source.dart';
import 'package:e7gezly_mobile/data/governorate_source.dart';
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

  // Phase 2 ٢‑٨: the screens draw whatever the sector source returns, so the
  // three non-numeric states have to be distinguishable on screen.
  group('sectors', () {
    testWidgets('server sectors replace the built-in labels and the offline banner', (
      tester,
    ) async {
      final router = buildRouter(CategoryCatalog(_FakeCategorySource(_serverSectors)));
      await tester.pumpWidget(E7gezlyApp(router: router));
      await tester.pumpAndSettle();

      expect(find.text('مطاعم وكافيهات'), findsOneWidget);
      expect(find.text('طاولات وبوفيهات مناسبات'), findsOneWidget);
      // The fallback copy is only true while nothing is connected.
      expect(find.text('لسه ما فيهوش قوائم حقيقية'), findsNothing);
      expect(find.text('خدمات تانية'), findsNothing);
    });

    testWidgets('a failed fetch is named as a failure, not as an empty market', (tester) async {
      final router = buildRouter(CategoryCatalog(_FailingCategorySource()));
      await tester.pumpWidget(E7gezlyApp(router: router));
      await tester.pumpAndSettle();

      expect(find.text('القطاعات مجاتش من السيرفر'), findsOneWidget);
      expect(find.text('لسه ما فيهوش قوائم حقيقية'), findsNothing);
    });

    testWidgets('retry after a failure draws the sectors', (tester) async {
      final source = _FlakyCategorySource();
      final router = buildRouter(CategoryCatalog(source));
      await tester.pumpWidget(E7gezlyApp(router: router));
      await tester.pumpAndSettle();

      await tester.tap(find.text('حاول تاني'));
      await tester.pumpAndSettle();

      expect(find.text('أماكن رياضية'), findsOneWidget);
      expect(find.text('القطاعات مجاتش من السيرفر'), findsNothing);
    });

    testWidgets('an empty answer says the server has no published sectors', (tester) async {
      final router = buildRouter(CategoryCatalog(_FakeCategorySource(const [])));
      await tester.pumpWidget(E7gezlyApp(router: router));
      await tester.pumpAndSettle();

      expect(find.text('السيرفر ما فيهوش قطاعات منشورة'), findsOneWidget);
    });

    testWidgets('search filters and chips come from the same server list', (tester) async {
      final router = buildRouter(CategoryCatalog(_FakeCategorySource(_serverSectors)));
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go('/search?category=sports-venues');
      await tester.pumpAndSettle();

      expect(find.text('القطاع: أماكن رياضية'), findsOneWidget);
      expect(find.text('تجميل وعناية'), findsNothing);
    });

    test('a sector icon key from the server maps to a glyph, unknown keys fall back', () {
      expect(E7Category.iconForKey('restaurant'), Icons.restaurant_outlined);
      expect(E7Category.iconForKey('sparkle'), Icons.auto_awesome_outlined);
      expect(E7Category.iconForKey('qasr'), Icons.auto_awesome_outlined);
      expect(E7Category.iconForKey(null), Icons.auto_awesome_outlined);
    });
  });

  // Phase 2 ٢‑٨: geography has no list carried inside the app, so every state
  // of it has to be named on screen instead of quietly filled.
  group('governorates', () {
    testWidgets('unconfigured build says there is no city source, sectors still fall back', (
      tester,
    ) async {
      final router = buildRouter(CategoryCatalog(_FakeCategorySource(_serverSectors)));
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go('/search');
      await tester.pumpAndSettle();

      expect(find.text('مفيش محافظات معروضة من سيرفر'), findsOneWidget);
      expect(find.text('المحافظة: الكل'), findsOneWidget);
    });

    testWidgets('server governorates become the city chips and the filter updates', (tester) async {
      final router = buildRouter(
        CategoryCatalog(_FakeCategorySource(_serverSectors)),
        GovernorateCatalog(_FakeGovernorateSource(_serverCities)),
      );
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go('/search');
      await tester.pumpAndSettle();

      expect(find.text('مفيش محافظات معروضة من سيرفر'), findsNothing);
      final chip = find.text('الجيزة');
      await tester.ensureVisible(chip);
      await tester.tap(chip);
      await tester.pumpAndSettle();

      expect(find.text('المحافظة: الجيزة'), findsOneWidget);

      await tester.tap(chip);
      await tester.pumpAndSettle();
      expect(find.text('المحافظة: الكل'), findsOneWidget);
    });

    testWidgets('a failed city fetch is named as a failure, retry draws the chips', (tester) async {
      final source = _FlakyGovernorateSource();
      final router = buildRouter(
        CategoryCatalog(_FakeCategorySource(_serverSectors)),
        GovernorateCatalog(source),
      );
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go('/search');
      await tester.pumpAndSettle();

      expect(find.text('المحافظات مجاتش من السيرفر'), findsOneWidget);

      await tester.tap(find.text('حاول تاني'));
      await tester.pumpAndSettle();

      expect(find.text('القاهرة'), findsOneWidget);
      expect(find.text('المحافظات مجاتش من السيرفر'), findsNothing);
    });

    testWidgets('an empty answer says the server has no published governorates', (tester) async {
      final router = buildRouter(
        CategoryCatalog(_FakeCategorySource(_serverSectors)),
        GovernorateCatalog(_FakeGovernorateSource(const [])),
      );
      await tester.pumpWidget(E7gezlyApp(router: router));
      router.go('/search');
      await tester.pumpAndSettle();

      expect(find.text('السيرفر ما فيهوش محافظات منشورة'), findsOneWidget);
    });

    test('an id that is no longer in the list reads as no city selected', () {
      expect(E7Governorate.byId(_serverCities, 2)?.nameAr, 'الجيزة');
      expect(E7Governorate.byId(_serverCities, 99), isNull);
      expect(E7Governorate.byId(_serverCities, null), isNull);
    });
  });

  // Phase 1 ١‑٧: every route has to lay out clean from a 320dp phone up to a wide
  // tablet, because the grid switches column count and the filter pills wrap.
  const sizes = <String, Size>{
    '320dp phone': Size(320, 640),
    'the common Android phone': Size(360, 800),
    'two-column threshold': Size(420, 800),
    'tablet portrait': Size(768, 1024),
    'wide window': Size(1200, 900),
  };
  const routes = <String>[
    '/',
    '/search?q=قاعة+أفراح',
    '/listing',
    '/booking',
    '/login',
    '/provider',
  ];

  for (final entry in sizes.entries) {
    for (final route in routes) {
      testWidgets('no layout overflow at ${entry.key} on $route', (tester) async {
        tester.view.physicalSize = entry.value;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.reset);

        final router = buildRouter();
        await tester.pumpWidget(E7gezlyApp(router: router));
        router.go(route);
        await tester.pumpAndSettle();

        // A RenderFlex overflow reports through takeException, so this single
        // assertion catches squeezed rows as well as hard framework errors.
        expect(tester.takeException(), isNull);
      });
    }
  }

  // The connected states share those layouts: a two-item grid, a notice card
  // in place of the grid, and a city chip row in place of the city notice.
  const dataRoutes = <String>['/', '/search?category=sports-venues'];
  final connectedVariants = <(String, GoRouter Function())>[
    ('server sectors', () => buildRouter(CategoryCatalog(_FakeCategorySource(_serverSectors)))),
    ('failed fetch', () => buildRouter(CategoryCatalog(_FailingCategorySource()))),
    (
      'server sectors and cities',
      () => buildRouter(
        CategoryCatalog(_FakeCategorySource(_serverSectors)),
        GovernorateCatalog(_FakeGovernorateSource(_serverCities)),
      ),
    ),
    (
      'failed city fetch',
      () => buildRouter(
        CategoryCatalog(_FakeCategorySource(_serverSectors)),
        GovernorateCatalog(_FailingGovernorateSource()),
      ),
    ),
  ];

  for (final entry in sizes.entries) {
    for (final variant in connectedVariants) {
      for (final route in dataRoutes) {
        testWidgets('no layout overflow at ${entry.key} on $route with ${variant.$1}', (
          tester,
        ) async {
          tester.view.physicalSize = entry.value;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.reset);

          final router = variant.$2();
          await tester.pumpWidget(E7gezlyApp(router: router));
          router.go(route);
          await tester.pumpAndSettle();

          expect(tester.takeException(), isNull);
        });
      }
    }
  }
}

/// Two rows shaped like `service_categories`, deliberately shorter than the eight
/// built-in labels so a test can tell the two sources apart.
final _serverSectors = <E7Category>[
  E7Category(
    slug: 'restaurants-cafes',
    nameAr: 'مطاعم وكافيهات',
    blurbAr: 'طاولات وبوفيهات مناسبات',
    icon: E7Category.iconForKey('restaurant'),
  ),
  E7Category(
    slug: 'sports-venues',
    nameAr: 'أماكن رياضية',
    blurbAr: 'ملاعب خماسي وباديل',
    icon: E7Category.iconForKey('sports'),
  ),
];

class _FakeCategorySource implements CategorySource {
  _FakeCategorySource(this.rows);

  final List<E7Category> rows;

  @override
  Future<List<E7Category>> load() async => rows;
}

class _FailingCategorySource implements CategorySource {
  @override
  Future<List<E7Category>> load() async => throw Exception('no route to host');
}

class _FlakyCategorySource implements CategorySource {
  int _calls = 0;

  @override
  Future<List<E7Category>> load() async {
    _calls++;
    if (_calls == 1) throw Exception('no route to host');
    return _serverSectors;
  }
}

/// Two rows shaped like `governorates`, short enough to tell apart from any
/// list someone might be tempted to carry inside the app.
final _serverCities = <E7Governorate>[
  E7Governorate(id: 1, nameAr: 'القاهرة'),
  E7Governorate(id: 2, nameAr: 'الجيزة'),
];

class _FakeGovernorateSource implements GovernorateSource {
  _FakeGovernorateSource(this.rows);

  final List<E7Governorate> rows;

  @override
  Future<List<E7Governorate>> load() async => rows;
}

class _FailingGovernorateSource implements GovernorateSource {
  @override
  Future<List<E7Governorate>> load() async => throw Exception('no route to host');
}

class _FlakyGovernorateSource implements GovernorateSource {
  int _calls = 0;

  @override
  Future<List<E7Governorate>> load() async {
    _calls++;
    if (_calls == 1) throw Exception('no route to host');
    return _serverCities;
  }
}
