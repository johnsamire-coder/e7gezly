import 'package:go_router/go_router.dart';

import 'data/category_source.dart';
import 'screens/home_screen.dart';
import 'screens/placeholder_screen.dart';
import 'screens/search_screen.dart';

String _searchPath({String? query, String? category}) {
  final params = <String, String>{};
  if (query != null && query.isNotEmpty) params['q'] = query;
  if (category != null) params['category'] = category;
  return Uri(path: '/search', queryParameters: params.isEmpty ? null : params).toString();
}

/// [catalog] is shared by the screens that show sectors, so one build asks the
/// server once. Tests hand it a fixed list.
GoRouter buildRouter([CategoryCatalog? catalog]) {
  final categories = catalog ?? CategoryCatalog();
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => HomeScreen(
          catalog: categories,
          onSearch: (query) => context.push(_searchPath(query: query)),
          onSelectCategory: (slug) => context.push(_searchPath(category: slug)),
        ),
      ),
      GoRoute(
        path: '/search',
        builder: (context, state) => SearchScreen(
          catalog: categories,
          query: state.uri.queryParameters['q'] ?? '',
          categorySlug: state.uri.queryParameters['category'],
        ),
      ),
      GoRoute(
        path: '/listing',
        builder: (context, state) => const PlaceholderScreen(
          title: 'تفاصيل الخدمة',
          reason:
              'دول محتاجين جدول listings المتصل بـ Supabase، وبعدها هتلاقي هنا '
              'المكان، المواعيد المتاحة، ونطاق السعر الحقيقي.',
        ),
      ),
      GoRoute(
        path: '/booking',
        builder: (context, state) => const PlaceholderScreen(
          title: 'طلب حجز',
          reason:
              'نموذج الطلب بيولّد طلب بحالة «في الانتظار» مش تأكيد حجز. '
              'التأكيد بيحصل لما مقدّم الخدمة يقبل، وده لسه ما اتبناش.',
        ),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const PlaceholderScreen(
          title: 'دخول الحساب',
          reason:
              'تسجيل الدخول بكود عبر رسالة نصية محتاج مشروع Supabase '
              'مزوّد بمصدر رسائل، ولسه ما اتحدّدش.',
        ),
      ),
      GoRoute(
        path: '/provider',
        builder: (context, state) => const PlaceholderScreen(
          title: 'التقديم كمقدّم خدمة',
          reason:
              'استمارة التقديم ومراجعتها من الإدارة جايين مع جدول listings '
              'وحالة المراجعة.',
        ),
      ),
    ],
    errorBuilder: (context, state) => PlaceholderScreen(
      title: 'الصفحة مش موجودة',
      reason: 'المسار «${state.uri}» مش مسجّل في الراوتر. اختار مسار تاني من الرئيسية.',
    ),
  );
}
