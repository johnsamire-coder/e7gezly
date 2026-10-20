
import 'package:flutter/material.dart';

import 'core/tokens.dart';

/// Cairo is a variable font, so weights are requested through `fontVariations`
/// rather than `fontWeight` (the static IBM Plex files use `fontWeight`).
TextStyle _display(TextStyle? base, int weight) => (base ?? const TextStyle()).copyWith(
      fontFamily: E7Font.display,
      fontVariations: [FontVariation.weight(weight.toDouble())],
      color: E7Color.ink900,
      height: 1.35,
    );

ThemeData buildE7Theme() {
  final base = ThemeData.from(
    colorScheme: ColorScheme.fromSeed(
      seedColor: E7Color.brand500,
      primary: E7Color.brand500,
      onPrimary: Colors.white,
      secondary: E7Color.accent500,
      surface: E7Color.card,
      error: E7Color.dangerFg,
    ),
    textTheme: const TextTheme(bodyMedium: TextStyle(fontFamily: E7Font.text)),
  );

  final tt = base.textTheme;

  return base.copyWith(
    scaffoldBackgroundColor: E7Color.canvas,
    textTheme: tt.copyWith(
      displayLarge: _display(tt.displayLarge, 700),
      displayMedium: _display(tt.displayMedium, 700),
      headlineLarge: _display(tt.headlineLarge, 700),
      headlineMedium: _display(tt.headlineMedium, 600),
      headlineSmall: _display(tt.headlineSmall, 600),
      titleLarge: _display(tt.titleLarge, 600),
      titleMedium: tt.titleMedium?.copyWith(fontFamily: E7Font.text, fontWeight: FontWeight.w600),
      bodyLarge: tt.bodyLarge?.copyWith(fontFamily: E7Font.text, height: E7Font.textLineHeight),
      bodyMedium: tt.bodyMedium?.copyWith(fontFamily: E7Font.text, height: E7Font.textLineHeight),
      labelLarge: tt.labelLarge?.copyWith(fontFamily: E7Font.text, fontWeight: FontWeight.w600),
    ),
    cardTheme: CardThemeData(
      color: E7Color.card,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(E7Radius.card),
        side: const BorderSide(color: E7Color.line),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(0, 50),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(E7Radius.control)),
        textStyle: const TextStyle(fontFamily: E7Font.text, fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(0, 48),
        side: const BorderSide(color: E7Color.line),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(E7Radius.control)),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: E7Color.card,
      contentPadding: const EdgeInsets.symmetric(horizontal: E7Space.md, vertical: E7Space.md),
      hintStyle: const TextStyle(color: E7Color.ink400, fontFamily: E7Font.text),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(E7Radius.control),
        borderSide: const BorderSide(color: E7Color.line),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(E7Radius.control),
        borderSide: const BorderSide(color: E7Color.line, width: 1.2),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(E7Radius.control),
        borderSide: const BorderSide(color: E7Color.brand500, width: 2),
      ),
    ),
    chipTheme: base.chipTheme.copyWith(
      shape: const StadiumBorder(),
      side: const BorderSide(color: E7Color.line),
      labelStyle: const TextStyle(fontFamily: E7Font.text, fontWeight: FontWeight.w500),
    ),
    dividerTheme: const DividerThemeData(color: E7Color.line, thickness: 1, space: E7Space.md),
    appBarTheme: const AppBarTheme(
      backgroundColor: E7Color.canvas,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontFamily: E7Font.display,
        fontWeight: FontWeight.w700,
        fontSize: 20,
        color: E7Color.brand700,
      ),
    ),
  );
}

