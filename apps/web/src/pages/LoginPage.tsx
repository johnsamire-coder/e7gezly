import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { c, fontDisplay, tokens } from '../lib/tokens';

type Values = { email: string };

export function LoginPage() {
  const { enabled, signInWithOtp } = useAuth();
  const [status, setStatus] = useState<{ kind: 'idle' | 'sent' | 'error'; message?: string }>({ kind: 'idle' });

  async function onSubmit({ email }: Values) {
    const { error } = await signInWithOtp({ email });
    if (error) setStatus({ kind: 'error', message: error });
    else setStatus({ kind: 'sent', message: `أرسلنا رابط دخول إلى ${email} إن كان الحساب موجودًا.` });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: tokens.space.lg,
        background: c.surface.canvas,
      }}
    >
      <Card style={{ width: 'min(420px, 100%)' }}>
        <Typography.Title level={3} style={{ fontFamily: fontDisplay, color: c.brand[700], marginTop: 0 }}>
          احجزلي
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          دخول مقدّمي الخدمة والإدارة فقط. تطبيق العملاء هو تطبيق الموبايل، وليس هذا الموقع.
        </Typography.Paragraph>

        {!enabled && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: tokens.space.md }}
            message="تسجيل الدخول معطّل"
            description="لا يوجد مشروع Supabase متصل، لذا لا يمكن التحقق من أي حساب. اضبط ملف البيئة قبل الاستخدام."
          />
        )}

        {status.kind === 'sent' && (
          <Alert type="success" showIcon style={{ marginBottom: tokens.space.md }} message={status.message} />
        )}
        {status.kind === 'error' && (
          <Alert type="error" showIcon style={{ marginBottom: tokens.space.md }} message={status.message} />
        )}

        <Form<Values> layout="vertical" onFinish={onSubmit} disabled={!enabled} initialValues={{ isAdmin: false }}>
          <Form.Item
            name="email"
            label="البريد الإلكتروني"
            rules={[{ required: true, message: 'أدخل بريدك الإلكتروني' }, { type: 'email', message: 'صيغة البريد غير صحيحة' }]}
          >
            <Input type="email" autoComplete="email" placeholder="name@example.com" dir="ltr" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            إرسال رابط الدخول
          </Button>
        </Form>

        <Typography.Paragraph style={{ marginTop: tokens.space.md, marginBottom: 0 }}>
          <Link to="/">العودة للوحة التحكم</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
