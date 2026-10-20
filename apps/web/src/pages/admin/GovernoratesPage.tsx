import { Alert, Card, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useList } from '@refinedev/core';
import { backendConfigured } from '../../lib/backend';
import type { GovernorateRow } from '../../lib/rows';
import { tokens } from '../../lib/tokens';

const columns: ColumnsType<GovernorateRow> = [
  { title: 'المحافظة', dataIndex: 'name_ar', key: 'name_ar' },
  {
    title: 'الاسم بالإنجليزية',
    dataIndex: 'name_en',
    key: 'name_en',
    render: (value: string | null) => (value ? <span dir="ltr">{value}</span> : <Typography.Text type="secondary">—</Typography.Text>),
  },
  {
    title: 'الرمز',
    dataIndex: 'code',
    key: 'code',
    width: 110,
    render: (value: string | null) => (value ? <Typography.Text code dir="ltr">{value}</Typography.Text> : '—'),
  },
  {
    title: 'الحالة',
    dataIndex: 'active',
    key: 'active',
    width: 110,
    render: (active: boolean) => (active ? <Tag color="success">مفعّل</Tag> : <Tag color="default">موقوف</Tag>),
  },
];

export function GovernoratesPage() {
  const { result, query } = useList<GovernorateRow>({
    resource: 'governorates',
    pagination: { pageSize: 50 },
    sorters: [{ field: 'sort_order', order: 'asc' }],
    queryOptions: { enabled: backendConfigured },
  });

  return (
    <Card
      title="المحافظات والمناطق"
      extra={<Typography.Text type="secondary">قراءة فقط في هذه المرحلة</Typography.Text>}
      styles={{ body: { paddingBlockStart: 0 } }}
    >
      <Typography.Paragraph type="secondary">
        بيانات جغرافية حقيقية لمصر، وليست بيانات تجريبية. جدول المناطق ما زال بلا صفوف،
        وهو الجزء التالي من هذه الشاشة.
      </Typography.Paragraph>

      {query.isError && backendConfigured && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: tokens.space.md }}
          message="تعذّر تحميل المحافظات"
          description="تحقّق من تطبيق الـ migrations ومن سياسة الوصول على جدول governorates."
        />
      )}

      <Table<GovernorateRow>
        rowKey="id"
        columns={columns}
        dataSource={result?.data ?? []}
        loading={query.isLoading && backendConfigured}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: backendConfigured
            ? 'لا توجد محافظات بعد. نفّذ supabase/seed/01_reference_data.sql.'
            : 'غير متاح — الخادم غير متصل',
        }}
      />
    </Card>
  );
}
