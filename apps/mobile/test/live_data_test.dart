// Talks to the real project, so it is skipped unless the build is configured:
//   flutter test test/live_data_test.dart --dart-define-from-file=env.local.json
// Nothing here invents data — every value asserted comes from Supabase.
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:e7gezly_mobile/core/env.dart';
import 'package:e7gezly_mobile/data/category_source.dart';

void main() {
  // Skipped without a config: `flutter test` in CI must not need the network.
  final skip = !E7Env.hasSupabase;

  setUpAll(() async {
    if (!E7Env.hasSupabase) return;
    // The plugin's session storage needs the platform channel this runner has
    // no host for; an empty mock is enough for an unauthenticated read.
    SharedPreferences.setMockInitialValues({});
    await Supabase.initialize(
      url: E7Env.supabaseUrl,
      publishableKey: E7Env.supabaseAnonKey,
    );
  });

  test('the project returns its published sectors as rows', () async {
    final sectors = await const SupabaseCategorySource().load();

    expect(sectors, isNotEmpty);
    for (final sector in sectors) {
      expect(sector.slug, isNotEmpty);
      expect(sector.nameAr, isNotEmpty);
    }
    // The seed puts restaurants first, and the app has to keep the server's order.
    expect(sectors.first.slug, 'restaurants-cafes');
  }, skip: skip);
}
