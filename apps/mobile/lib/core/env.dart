/// Build-time configuration, supplied with
/// `flutter run --dart-define-from-file=env.local.json`.
/// Nothing here is a secret: only the public anon key is used, and the file it
/// comes from is gitignored. An unconfigured build stays on the built-in
/// reference labels and the screens say so out loud.
abstract final class E7Env {
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  static bool get hasSupabase => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;
}
