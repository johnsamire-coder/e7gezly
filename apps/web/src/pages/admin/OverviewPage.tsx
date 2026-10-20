import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useList } from '@refinedev/core';
import { backendConfigured } from '../../lib/backend';
import { c, tokens } from '../../lib/tokens';

type Counted = { result?: { total?: number }; query: { isLoading: boolean } };

function Stat({ title, value, loading }: { title: string; value: number | null; loading: boolean }) {
  return (
    <Card>
      <Statistic
        title={title}
        value={value ?? (loading ? '…' : '—')}
        valueStyle={{ color: c.brand[700], fontSize: 28 }}
      />
    </Card>
  );
}

function totalOf({ result }: Counted): number | null {
  return backendConfigured ? (result?.total ?? 0) : null;
}

export function OverviewPage() {
  const queryOptions = { enabled: backendConfigured };
  const categories = useList({ resource: 'service_categories', pagination: { pageSize: 1 }, queryOptions });
  const governorates = useList({ resource: 'governorates', pagination: { pageSize: 1 }, queryOptions });
  const areas = useList({ resource: 'areas', pagination: { pageSize: 1 }, queryOptions });

  return (
    <>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        نظرة عامة
      </Typography.Title>

      <Row gutter={[tokens.space.md, tokens.space.md]}>
        <Col xs={24} sm={12} lg={8}>
          <Stat title="أقسام الخدمات" value={totalOf(categories)} loading={categories.query.isLoading} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Stat title="المحافظات" value={totalOf(governorates)} loading={governorates.query.isLoading} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Stat title="المناطق" value={totalOf(areas)} loading={areas.query.isLoading} />
        </Col>
      </Row>

      <Card title="لم يُبنَ بعد" style={{ marginTop: tokens.space.lg }}>
        <Typography.Paragraph style={{ marginBottom: tokens.space.sm }}>
          هذه الشاشات غير موجودة في هذه المرحلة بشكل مقصود، لا أنها موجودة وفارغة:
        </Typography.Paragraph>
        <ul style={{ margin: 0, paddingInlineStart: tokens.space.lg }}>
          <li>قوائم مقدمي الخدمة ومراجعتها</li>
          <li>طلبات الحجز وحالتها</li>
          <li>إدارة الحسابات والصلاحيات</li>
        </ul>
      </Card>
    </>
  );
}
