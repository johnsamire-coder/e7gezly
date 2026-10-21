/// Egyptian mobile numbers, and nothing else.
///
/// A verification code has to reach a SIM, so a landline is not a slower path —
/// it is a dead one. Same for a number we misread: the user waits for a message
/// that was never sent, and no screen can tell them why. So one parse runs on
/// the device, and the server stores the exact same string.
enum E7PhoneProblem { none, empty, letters, landline, wrongLength, wrongCountry }

typedef E7PhoneInput = ({String? e164, E7PhoneProblem problem});

abstract final class E7Phone {
  static const String _countryCode = '20';

  /// Every Egyptian mobile is 01 + 9 digits, because the national prefix 01 is
  /// the one the regulator reserves for mobile. 010/011/012/015 are the ones in
  /// service today, but a fifth is a numbering decision, not a typo — so the
  /// second digit is not checked. A landline never starts with 01 at all.
  static final RegExp _mobile = RegExp(r'^1\d{9}$');

  /// Cairo is area code 2 and Alexandria 3; every other landline governorate
  /// code is a single digit 4-9. Subscriber numbers are 7 or 8 digits.
  static final RegExp _landline = RegExp(r'^[2-9]\d{7,9}$');

  /// Separators a dial pad or a copy-paste leaves behind, plus the two invisible
  /// direction marks an Arabic field can carry inside the number.
  static final RegExp _separators = RegExp('[\\s\\-()./\\u00A0\\u200E\\u200F]');

  /// Normalises what a person actually types — `01012345678`, `+20 101 234
  /// 5678`, `٠١٠١٢٣٤٥٦٧٨`, `0020…` — into `+20` + 10 digits.
  ///
  /// Arabic-Indic and Persian digits fold to Latin ones because the app runs in
  /// `ar` and several Android keyboards type ٠١٢ by default.
  static E7PhoneInput parse(String raw) {
    final text = raw.trim();
    if (text.isEmpty) return (e164: null, problem: E7PhoneProblem.empty);
    // A plus in the middle of a number is a mistype, not an international prefix.
    if (text.contains('+') && !text.startsWith('+')) {
      return (e164: null, problem: E7PhoneProblem.letters);
    }

    final String digits;
    try {
      digits = _digitsOnly(text);
    } on _PhoneHasLetters {
      return (e164: null, problem: E7PhoneProblem.letters);
    }
    if (digits.isEmpty) return (e164: null, problem: E7PhoneProblem.empty);

    var local = digits;
    final bool international;
    if (text.startsWith('+')) {
      international = true;
    } else if (digits.startsWith('00')) {
      international = true;
      local = digits.substring(2);
    } else {
      international = false;
    }

    if (international) {
      if (!local.startsWith(_countryCode)) {
        return (e164: null, problem: E7PhoneProblem.wrongCountry);
      }
      local = local.substring(_countryCode.length);
    }

    // "+20 010…" is how Egyptians write a number on a card, so the extra
    // national zero is a formatting habit, not a different number.
    if (local.startsWith('0')) local = local.substring(1);

    if (_mobile.hasMatch(local)) {
      return (e164: '+$_countryCode$local', problem: E7PhoneProblem.none);
    }
    if (_landline.hasMatch(local)) return (e164: null, problem: E7PhoneProblem.landline);
    return (e164: null, problem: E7PhoneProblem.wrongLength);
  }

  /// The number as an Egyptian reads it on a card: 010 1234 5678.
  ///
  /// Display only — `e164` is the only form that ever leaves the device.
  static String displayLocal(String e164) {
    final national = e164.replaceFirst(RegExp(r'^\+20'), '0');
    if (national.length != 11) return e164;
    return '${national.substring(0, 3)} ${national.substring(3, 7)} ${national.substring(7)}';
  }

  /// Egyptian Arabic, because "invalid format" tells a person nothing.
  static String problemAr(E7PhoneProblem problem) => switch (problem) {
    E7PhoneProblem.none => '',
    E7PhoneProblem.empty => 'اكتب رقم الموبايل الأول.',
    E7PhoneProblem.letters => 'الخانة دي أرقام بس، من غير حروف.',
    E7PhoneProblem.landline => 'ده خط أرضي — كود التحقق بيوصل على موبايل بس.',
    E7PhoneProblem.wrongLength => 'الرقم لازم يكون ١١ خانة زي موبايلات مصر، زي 010 1234 5678.',
    E7PhoneProblem.wrongCountry => 'احنا شغالين في مصر بس دلوقتي: الرقم يبدأ بـ 010 أو ‎+2010.',
  };

  static String _digitsOnly(String value) {
    final onlyDigits = _foldArabicDigits(value).replaceAll(_separators, '').replaceAll('+', '');
    if (!RegExp(r'^\d+$').hasMatch(onlyDigits)) throw _PhoneHasLetters();
    return onlyDigits;
  }

  /// Arabic-Indic ٠١٢ and Persian ۰۱۲ become Latin 012. Dart's `\d` matches
  /// ASCII only, so without this an Arabic keyboard's number is a letter error.
  static String _foldArabicDigits(String value) {
    final out = StringBuffer();
    for (final rune in value.runes) {
      if (rune >= 0x0660 && rune <= 0x0669) {
        out.writeCharCode(0x30 + rune - 0x0660);
      } else if (rune >= 0x06F0 && rune <= 0x06F9) {
        out.writeCharCode(0x30 + rune - 0x06F0);
      } else {
        out.writeCharCode(rune);
      }
    }
    return out.toString();
  }
}

class _PhoneHasLetters implements Exception {}
