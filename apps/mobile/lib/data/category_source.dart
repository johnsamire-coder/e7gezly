import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/categories.dart';
import '../core/env.dart';

/// Where the launch verticals come from. Screens only know this seam, so a test
/// can hand them a fixed list and an unconfigured build stays offline.
abstract class CategorySource {
  Future<List<E7Category>> load();
}

/// The labels carried inside the app. Used only when the build has no Supabase
/// config, and the screens have to say that they are using them.
class BuiltInCategorySource implements CategorySource {
  const BuiltInCategorySource();

  @override
  Future<List<E7Category>> load() async => E7Category.builtIn;
}

/// Root rows of `service_categories`, in the order the admin portal sets.
class SupabaseCategorySource implements CategorySource {
  const SupabaseCategorySource();

  @override
  Future<List<E7Category>> load() async {
    final rows = await Supabase.instance.client
        .from('service_categories')
        .select('slug,name_ar,description_ar,icon,sort_order')
        .isFilter('parent_id', null)
        .eq('active', true)
        // The client defaults to descending, which would flip the admin's order.
        .order('sort_order', ascending: true);
    return [for (final row in rows) _fromRow(row)];
  }

  static E7Category _fromRow(Map<String, dynamic> row) => E7Category(
    slug: row['slug'] as String,
    nameAr: row['name_ar'] as String,
    blurbAr: (row['description_ar'] as String?) ?? '',
    icon: E7Category.iconForKey(row['icon'] as String?),
  );
}

CategorySource defaultCategorySource() =>
    E7Env.hasSupabase ? const SupabaseCategorySource() : const BuiltInCategorySource();

/// The verticals, fetched once for the whole app.
///
/// Screens listen instead of fetching, so home and search never ask twice and a
/// failed fetch stays visibly failed — a silent fallback would look like real
/// data, which is the one thing this app is not allowed to show.
class CategoryCatalog extends ChangeNotifier {
  CategoryCatalog([CategorySource? source]) : _source = source ?? defaultCategorySource() {
    if (isBuiltInOnly) {
      // The fallback labels ship inside the app, so there is nothing to fetch
      // and no frame where the home grid should be empty.
      _loaded = true;
      _categories = E7Category.builtIn;
      return;
    }
    // Fetched here, not from a screen's initState: a screen only subscribes
    // after its first build, so a fetch that finished before that would notify
    // nobody and leave a loading frame on screen for good.
    _fetch();
  }

  final CategorySource _source;

  List<E7Category> _categories = const [];
  bool _loaded = false;
  bool _failed = false;

  List<E7Category> get categories => _loaded ? _categories : const [];

  bool get isLoading => !_loaded && !_failed;

  bool get hasFailed => _failed;

  /// True when the labels on screen are the ones carried inside the app rather
  /// than rows from the server. Any screen showing them has to say so.
  bool get isBuiltInOnly => _source is BuiltInCategorySource;

  void retry() {
    _failed = false;
    notifyListeners();
    _fetch();
  }

  Future<void> _fetch() async {
    try {
      _categories = await _source.load();
      _loaded = true;
      _failed = false;
    } catch (_) {
      // Zero rows from the server is a real state, reported as empty; this
      // branch is only for a request that did not answer.
      _loaded = false;
      _failed = true;
    }
    notifyListeners();
  }
}
