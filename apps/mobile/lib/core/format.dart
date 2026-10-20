import 'package:intl/intl.dart';

/// Arabic formatting for the Egyptian market.
///
/// Locale is `ar`, not `ar_EG`: intl's `ar_EG` data renders Arabic-Indic digits
/// (١٬٢٠٠) while the brand tokens require Latin digits (1,200), which is what
/// plain `ar` produces. Verified against intl 0.20.2, not assumed.
abstract final class E7Format {
  static const _locale = 'ar';
  static const _currencySymbol = 'ج.م';

  static final NumberFormat _currency = NumberFormat.currency(
    locale: _locale,
    symbol: _currencySymbol,
    name: 'EGP',
    decimalDigits: 0,
  );

  static final DateFormat _date = DateFormat('d MMMM y', _locale);
  static final DateFormat _dateWithWeekday = DateFormat('EEEE، d MMMM y', _locale);
  static final DateFormat _time = DateFormat('h:mm a', _locale);

  static String egp(num amount) => _currency.format(amount);

  static String date(DateTime value) => _date.format(value);

  static String dateWithWeekday(DateTime value) => _dateWithWeekday.format(value);

  static String time(DateTime value) => _time.format(value);

  static String priceBandRange(int low, int high) => '${_currency.format(low)} – ${_currency.format(high)}';
}
