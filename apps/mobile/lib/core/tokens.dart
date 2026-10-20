import 'package:flutter/material.dart';

/// Brand values mirrored from `packages/tokens/tokens.json`.
/// Phase 0.6 replaces this file with one generated from the token source, so
/// edit `tokens.json` and regenerate — never edit the hexes here.
abstract final class E7Color {
  static const brand50 = Color(0xFFEAF6F3);
  static const brand100 = Color(0xFFCFE9E2);
  static const brand200 = Color(0xFFA3D5C8);
  static const brand300 = Color(0xFF6BB9A7);
  static const brand400 = Color(0xFF359A83);
  static const brand500 = Color(0xFF14806B);
  static const brand600 = Color(0xFF0C6E5C);
  static const brand700 = Color(0xFF0A5949);
  static const brand800 = Color(0xFF084437);
  static const brand900 = Color(0xFF062E26);

  static const accent100 = Color(0xFFFDEFD6);
  static const accent300 = Color(0xFFF4C784);
  static const accent500 = Color(0xFFE8963A);
  static const accent600 = Color(0xFFCC7A1F);
  static const accent700 = Color(0xFFA35F16);

  static const ink400 = Color(0xFF6B7F8C);
  static const ink500 = Color(0xFF4A5E6B);
  static const ink600 = Color(0xFF2D4150);
  static const ink800 = Color(0xFF16232E);
  static const ink900 = Color(0xFF0D1720);

  static const canvas = Color(0xFFF4F7F8);
  static const card = Color(0xFFFFFFFF);
  static const sand = Color(0xFFFBF7F0);
  static const line = Color(0xFFDFE7EA);

  static const warningBg = Color(0xFFFDF0D8);
  static const warningFg = Color(0xFF93600F);
  static const dangerBg = Color(0xFFFDE8E8);
  static const dangerFg = Color(0xFFC0392B);
}

abstract final class E7Radius {
  static const card = 14.0;
  static const control = 10.0;
  static const pill = 999.0;
}

abstract final class E7Space {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 16.0;
  static const lg = 24.0;
  static const xl = 32.0;
  static const xxl = 48.0;
}

abstract final class E7Font {
  static const display = 'Cairo';
  static const text = 'IBM Plex Sans Arabic';
  static const textLineHeight = 1.7;
  static const baseSize = 16.0;
}
