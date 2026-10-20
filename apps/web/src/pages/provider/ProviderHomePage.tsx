import { Card, Result, Tag, Typography } from 'antd';
import { tokens } from '../../lib/tokens';

export function ProviderHomePage() {
  return (
    <Card>
      <Result
        status="info"
        title="لوحة مقدّم الخدمة لم تُبنَ بعد"
        subTitle={
          <>
            <Tag color="default" style={{ marginInlineEnd: tokens.space.sm }}>
              لاحقًا
            </Tag>
            هذه الشاشة مقصود أنها بلا عمليات: إنشاء القوائم، أسعار الفئات، واستقبال طلبات الحجز
            كلها ضمن المرحلة الأولى (Phase 1) بعد جداول <code>listings</code> و<code>bookings</code>.
          </>
        }
      />
      <Typography.Paragraph type="secondary" style={{ marginTop: tokens.space.lg, marginBottom: 0 }}>
        ما يعمل الآن: الأقسام والمحافظات الحقيقية، وصلاحيات الحسابات.
      </Typography.Paragraph>
    </Card>
  );
}
