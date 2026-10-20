import { Alert } from 'antd';

/**
 * Shown whenever a page would otherwise display data. Reads as:
 * "we cannot answer this yet", never as "the database is empty".
 */
export function BackendNotice() {
  return (
    <Alert
      type="warning"
      showIcon
      message="الخادم غير متصل"
      description={
        <>
          لم تُضبط متغيّرات <code>VITE_SUPABASE_URL</code> و<code>VITE_SUPABASE_ANON_KEY</code>،
          لذلك لا يمكن قراءة أي بيانات حقيقية. لا تعرض هذه الشاشة قائمة فارغة على أنها «لا توجد
          سجلات» — الوضع غير معروف. انسخ <code>.env.example</code> إلى <code>.env.local</code> بعد
          إنشاء مشروع Supabase وتطبيق الـ migrations.
        </>
      }
      style={{ marginBottom: 16 }}
    />
  );
}
