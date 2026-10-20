import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart' show Intl;
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/env.dart';
import 'router.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  initializeDateFormatting('ar');
  Intl.defaultLocale = 'ar';
  // Only the public anon key is ever compiled in — the service key stays on the
  // server. Without a config the app still runs, on the labels it carries, and
  // the screens say that they are doing so.
  if (E7Env.hasSupabase) {
    await Supabase.initialize(url: E7Env.supabaseUrl, publishableKey: E7Env.supabaseAnonKey);
  }
  runApp(E7gezlyApp());
}

class E7gezlyApp extends StatelessWidget {
  E7gezlyApp({super.key, GoRouter? router}) : _router = router ?? buildRouter();

  final GoRouter _router;

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'احجزلي',
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
      theme: buildE7Theme(),
      // Arabic drives RTL through MaterialApp's locale-based text direction.
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}
