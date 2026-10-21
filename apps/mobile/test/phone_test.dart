import 'package:flutter_test/flutter_test.dart';

import 'package:e7gezly_mobile/core/phone.dart';

void main() {
  const e164 = '+201012345678';

  group('the same number, however a person types it', () {
    const spellings = [
      '01012345678',
      '+201012345678',
      '+20 101 234 5678',
      '+2001012345678',
      '+20 010 1234 5678',
      '00201012345678',
      '010-123-456-78',
      '010 123 456 78',
      '٠١٠١٢٣٤٥٦٧٨',
      '۰۱۰۱۲۳۴۵۶۷۸',
      '‏01012345678‎',
      ' 01012345678 ',
    ];

    for (final spelling in spellings) {
      test('"$spelling"', () {
        final parsed = E7Phone.parse(spelling);
        expect(parsed.problem, E7PhoneProblem.none, reason: E7Phone.problemAr(parsed.problem));
        expect(parsed.e164, e164);
      });
    }

    test('all twelve spellings collapse to the one string the server stores', () {
      expect({for (final s in spellings) E7Phone.parse(s).e164}, {e164});
    });

    test('the four prefixes in service today are all mobile', () {
      for (final prefix in ['010', '011', '012', '015']) {
        expect(
          E7Phone.parse('$prefix 1234 5678').e164,
          '+20${prefix.substring(1)}12345678',
          reason: prefix,
        );
      }
    });

    test('a prefix nobody holds today still parses, because that is numbering, not a typo', () {
      expect(E7Phone.parse('01312345678').problem, E7PhoneProblem.none);
    });
  });

  group('what cannot receive a code', () {
    test('a landline is named as a landline, not as a length problem', () {
      expect(E7Phone.parse('0212345678').problem, E7PhoneProblem.landline);
      expect(E7Phone.parse('+2031234567').problem, E7PhoneProblem.landline);
      expect(E7Phone.parse('0881234567').problem, E7PhoneProblem.landline);
    });

    test('a foreign number says so instead of silently trimming digits', () {
      expect(E7Phone.parse('+1 416 555 0123').problem, E7PhoneProblem.wrongCountry);
      expect(E7Phone.parse('0044 1632 960 001').problem, E7PhoneProblem.wrongCountry);
    });

    test('too short and too long are both length problems', () {
      expect(E7Phone.parse('0101234').problem, E7PhoneProblem.wrongLength);
      expect(E7Phone.parse('010123456789').problem, E7PhoneProblem.wrongLength);
      expect(E7Phone.parse('+2011123456789').problem, E7PhoneProblem.wrongLength);
    });

    test('letters, a misplaced plus, and nothing at all', () {
      expect(E7Phone.parse('0101234abcd').problem, E7PhoneProblem.letters);
      expect(E7Phone.parse('0101+2345678').problem, E7PhoneProblem.letters);
      expect(E7Phone.parse('').problem, E7PhoneProblem.empty);
      expect(E7Phone.parse('   ').problem, E7PhoneProblem.empty);
    });

    test('every refusal carries an Egyptian sentence a person can act on', () {
      for (final problem in E7PhoneProblem.values.where((p) => p != E7PhoneProblem.none)) {
        expect(E7Phone.problemAr(problem), isNotEmpty, reason: problem.name);
      }
      expect(E7Phone.problemAr(E7PhoneProblem.landline), contains('أرضي'));
      expect(E7Phone.problemAr(E7PhoneProblem.wrongCountry), contains('مصر'));
    });

    test('a refusal never stores a number', () {
      for (final raw in ['0212345678', '+14165550123', '0101234', 'abc']) {
        expect(E7Phone.parse(raw).e164, isNull, reason: raw);
      }
    });
  });

  group('display', () {
    test('a stored number reads the way a card writes it', () {
      expect(E7Phone.displayLocal(e164), '010 1234 5678');
    });

    test('anything malformed is shown as it arrived rather than sliced wrong', () {
      expect(E7Phone.displayLocal('010123'), '010123');
      expect(E7Phone.displayLocal(''), '');
    });
  });
}
