import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart' show Intl;

import 'router.dart';
import 'theme.dart';

void main() {
  initializeDateFormatting('ar');
  Intl.defaultLocale = 'ar';
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
