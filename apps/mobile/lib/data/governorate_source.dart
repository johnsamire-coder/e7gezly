import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/env.dart';
import '../core/geography.dart';

/// Where the city filter gets its governorates from. Screens only know this
/// seam, so a test can hand them a fixed list.
abstract class GovernorateSource {
  Future<List<E7Governorate>> load();
}

/// Rows of `governorates`, in the order the admin portal sets. The read policy
/// answers with inactive rows too, so "active only" has to come from the query.
class SupabaseGovernorateSource implements GovernorateSource {
  const SupabaseGovernorateSource();

  @override
  Future<List<E7Governorate>> load() async {
    final rows = await Supabase.instance.client
        .from('governorates')
        .select('id,name_ar,sort_order')
        .eq('active', true)
        // The client defaults to descending, which would flip the admin's order.
        .order('sort_order', ascending: true);
    return [
      for (final row in rows)
        E7Governorate(id: (row['id'] as num).toInt(), nameAr: row['name_ar'] as String),
    ];
  }
}

/// Null means this build has no server to ask.
///
/// Sectors fall back to labels carried inside the app; geography deliberately
/// does not. A list of Egyptian governorates baked in would look exactly like
/// rows the admin portal manages, and it would be neither.
GovernorateSource? defaultGovernorateSource() =>
    E7Env.hasSupabase ? const SupabaseGovernorateSource() : null;

/// The governorates, fetched once for the whole app.
class GovernorateCatalog extends ChangeNotifier {
  GovernorateCatalog([GovernorateSource? source]) : _source = source ?? defaultGovernorateSource() {
    // Fetched here, not from a screen's initState: a screen only subscribes
    // after its first build, so a fetch that finished before that would notify
    // nobody and leave a loading frame on screen for good.
    if (isConfigured) _fetch();
  }

  final GovernorateSource? _source;

  List<E7Governorate> _governorates = const [];
  bool _loaded = false;
  bool _failed = false;

  List<E7Governorate> get governorates => _loaded ? _governorates : const [];

  bool get isConfigured => _source != null;

  bool get isLoading => isConfigured && !_loaded && !_failed;

  bool get hasFailed => _failed;

  void retry() {
    _failed = false;
    notifyListeners();
    _fetch();
  }

  Future<void> _fetch() async {
    final source = _source;
    if (source == null) return;
    try {
      _governorates = await source.load();
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
