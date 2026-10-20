import 'package:flutter/material.dart';

import '../core/categories.dart';
import '../core/tokens.dart';
import '../widgets/data_offline_banner.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.onSearch, required this.onSelectCategory});

  final void Function(String query) onSearch;
  final void Function(String slug) onSelectCategory;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() => widget.onSearch(_controller.text.trim());

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(E7Space.md, E7Space.lg, E7Space.md, 0),
              sliver: SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('احجزلي', style: theme.textTheme.headlineMedium?.copyWith(color: E7Color.brand700)),
                    const SizedBox(height: E7Space.xs),
                    Text(
                      'احجز اللي محتاجه في مصر — من التليفون',
                      style: theme.textTheme.bodyMedium?.copyWith(color: E7Color.ink500),
                    ),
                    const SizedBox(height: E7Space.lg),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _controller,
                            textInputAction: TextInputAction.search,
                            onSubmitted: (_) => _submit(),
                            decoration: const InputDecoration(
                              hintText: 'عايز تحجز إيه؟',
                              prefixIcon: Icon(Icons.search),
                            ),
                          ),
                        ),
                        const SizedBox(width: E7Space.sm),
                        FilledButton(
                          onPressed: _submit,
                          style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: E7Space.lg)),
                          child: const Text('دوّر'),
                        ),
                      ],
                    ),
                    const SizedBox(height: E7Space.sm),
                    Text(
                      'مساعد الحجز بالذكاء الاصطناعي هييجي لاحقًا — دلوقتي البحث بالكلمة أو بالقطاع.',
                      style: theme.textTheme.bodySmall?.copyWith(color: E7Color.ink400),
                    ),
                  ],
                ),
              ),
            ),
            const SliverPadding(
              padding: EdgeInsets.fromLTRB(E7Space.md, E7Space.md, E7Space.md, 0),
              sliver: SliverToBoxAdapter(child: DataOfflineBanner()),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(E7Space.md, E7Space.lg, E7Space.md, E7Space.md),
              sliver: SliverLayoutBuilder(
                builder: (context, constraints) {
                  final columns = constraints.crossAxisExtent < 420 ? 1 : 2;
                  // Height is what the two text lines need; the aspect ratio is
                  // derived from the available width so cards never get squeezed.
                  const tileHeight = 104.0;
                  final tileWidth =
                      (constraints.crossAxisExtent - (columns - 1) * E7Space.md) / columns;
                  return SliverGrid.count(
                    crossAxisCount: columns,
                    mainAxisSpacing: E7Space.md,
                    crossAxisSpacing: E7Space.md,
                    childAspectRatio: tileWidth / tileHeight,
                    children: [
                      for (final category in E7Category.all)
                        _CategoryCard(
                          category: category,
                          onTap: () => widget.onSelectCategory(category.slug),
                        ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({required this.category, required this.onTap});

  final E7Category category;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: E7Color.card,
      borderRadius: BorderRadius.circular(E7Radius.card),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Ink(
          decoration: BoxDecoration(
            border: Border.all(color: E7Color.line),
            borderRadius: BorderRadius.circular(E7Radius.card),
          ),
          child: Padding(
            padding: const EdgeInsets.all(E7Space.md),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(color: E7Color.brand50, shape: BoxShape.circle),
                  child: Icon(category.icon, color: E7Color.brand600),
                ),
                const SizedBox(width: E7Space.sm),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(category.nameAr, style: theme.textTheme.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 2),
                      Text(
                        category.blurbAr,
                        style: theme.textTheme.bodySmall?.copyWith(color: E7Color.ink500),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
