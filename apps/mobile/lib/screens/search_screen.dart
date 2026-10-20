import 'package:flutter/material.dart';

import '../core/categories.dart';
import '../core/format.dart';
import '../core/tokens.dart';
import '../widgets/data_offline_banner.dart';
import '../widgets/e7_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key, required this.query, required this.categorySlug});

  final String query;
  final String? categorySlug;

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late String? _category = widget.categorySlug;
  DateTime? _date;
  double _maxPrice = 1500;

  @override
  void didUpdateWidget(SearchScreen old) {
    super.didUpdateWidget(old);
    if (old.query != widget.query || old.categorySlug != widget.categorySlug) {
      setState(() {
        _category = widget.categorySlug;
      });
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _date ?? now,
      firstDate: now,
      lastDate: DateTime(now.year + 1, 12, 31),
      helpText: 'اختار يوم الحجز',
    );
    if (picked != null) setState(() => _date = picked);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selected = E7Category.bySlug(_category);

    return Scaffold(
      appBar: AppBar(title: const Text('نتائج البحث')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(E7Space.md),
          children: [
            E7Card(
              padding: const EdgeInsets.all(E7Space.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.query.isEmpty ? 'بحث بالقطاع' : '«${widget.query}»',
                    style: theme.textTheme.titleLarge,
                  ),
                  const SizedBox(height: E7Space.sm),
                  Wrap(
                    spacing: E7Space.xs,
                    runSpacing: E7Space.xs,
                    children: [
                      _FilterPill(label: 'القطاع: ${selected?.nameAr ?? 'الكل'}'),
                      _FilterPill(label: 'اليوم: ${_date == null ? 'من غير تحديد' : E7Format.date(_date!)}'),
                      _FilterPill(label: 'أقل من: ${E7Format.egp(_maxPrice.round())}'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: E7Space.md),
            Text('القطاعات', style: theme.textTheme.titleMedium),
            const SizedBox(height: E7Space.sm),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  for (final category in E7Category.all) ...[
                    ChoiceChip(
                      label: Text(category.nameAr),
                      selected: _category == category.slug,
                      onSelected: (on) => setState(() => _category = on ? category.slug : null),
                    ),
                    const SizedBox(width: E7Space.sm),
                  ],
                ],
              ),
            ),
            const SizedBox(height: E7Space.md),
            OutlinedButton.icon(
              onPressed: _pickDate,
              icon: const Icon(Icons.event_outlined),
              label: Text(_date == null ? 'اختار يوم' : E7Format.dateWithWeekday(_date!)),
            ),
            const SizedBox(height: E7Space.xs),
            Text('أقل من ${E7Format.egp(_maxPrice.round())}', style: theme.textTheme.bodyMedium),
            Slider(
              value: _maxPrice,
              min: 100,
              max: 5000,
              divisions: 49,
              label: E7Format.egp(_maxPrice.round()),
              onChanged: (value) => setState(() => _maxPrice = value),
            ),
            const SizedBox(height: E7Space.md),
            const DataOfflineBanner(title: 'مفيش نتائج نعرضها'),
            const SizedBox(height: E7Space.sm),
            Text(
              'الفلاتر دي بتشتغل فعليًا وبتغيّر الحالة قدامك، وأول ما التطبيق يتربط '
              'بالبيانات الحقيقية هتفلتر النتائج. مفيش هنا نتائج وهمية ولا مقدمين مُختلَقين.',
              style: theme.textTheme.bodySmall?.copyWith(color: E7Color.ink400),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilterPill extends StatelessWidget {
  const _FilterPill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) => Chip(
        // The label colour has to be set: a Chip on a custom background inherits
        // Material's muted onSurfaceVariant, which is unreadable on brand50.
        label: Text(
          label,
          style: const TextStyle(
            fontSize: E7Font.chipLabelSize,
            fontWeight: FontWeight.w500,
            color: E7Color.selectFg,
          ),
        ),
        backgroundColor: E7Color.brand50,
        side: const BorderSide(color: E7Color.brand100),
      );
}
