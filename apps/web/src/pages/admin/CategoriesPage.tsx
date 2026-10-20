import { useMemo } from 'react';
import { Alert, Card, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useList } from '@refinedev/core';
import { backendConfigured } from '../../lib/backend';
import type { ServiceCategoryRow } from '../../lib/rows';
import { tokens } from '../../lib/tokens';

type Row = ServiceCategoryRow & { children?: Row[] };

function buildTree(rows: ServiceCategoryRow[]): Row[] {
  const byId = new Map<number, Row>(rows.map((row) => [row.id, { ...row }]));
  const roots: Row[] = [];
  for (const node of byId.values()) {
    const parent = node.parent_id == null ? undefined : byId.get(node.parent_id);
    if (parent) (parent.children ??= []).push(node);
    else roots.push(node);
  }
  return roots;
}

const columns: ColumnsType<Row> = [
  { title: 'القسم', dataIndex: 'name_ar', key: 'name_ar' },
  {
    title: 'المعرّف',
    dataIndex: 'slug',
    key: 'slug',
    render: (slug: string) => (
      <Typography.Text code dir="ltr">
        {slug}
      </Typography.Text>
    ),
  },
  {
    title: 'الحالة',
    dataIndex: 'active',
    key: 'active',
    width: 110,
    render: (active: boolean) => (active ? <Tag color="success">مفعّل</Tag> : <Tag color="default">موقوف</Tag>),
  },
  { title: 'الترتيب', dataIndex: 'sort_order', key: 'sort_order', width: 90 },
];

export function CategoriesPage() {
  const { result, query } = useList<ServiceCategoryRow>({
    resource: 'service_categories',
    pagination: { pageSize: 200 },
    sorters: [{ field: 'sort_order', order: 'asc' }],
    queryOptions: { enabled: backendConfigured },
  });

  const tree = useMemo(() => buildTree(result?.data ?? []), [result]);

  return (
    <Card
      title="أقسام الخدمات"
      extra={<Typography.Text type="secondary">قراءة فقط في هذه المرحلة</Typography.Text>}
      styles={{ body: { paddingBlockStart: 0 } }}
    >
      <Typography.Paragraph type="secondary">
        الشجرة قابلة للتوسّع: الجذور هي قطاعات الإطلاق، والأبناء خدمات فرعية. إضافة قطاع جديد
        تبقى بيانات وإعدادات، لا تعديل قاعدة بيانات.
      </Typography.Paragraph>

      {query.isError && backendConfigured && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: tokens.space.md }}
          message="تعذّر تحميل الأقسام"
          description="تحقّق من تطبيق الـ migrations ومن سياسة الوصول على جدول service_categories."
        />
      )}

      <Table<Row>
        rowKey="id"
        columns={columns}
        dataSource={tree}
        loading={query.isLoading && backendConfigured}
        pagination={false}
        scroll={{ x: 'max-content' }}
        expandable={{ defaultExpandAllRows: true }}
        locale={{
          emptyText: backendConfigured
            ? 'لا توجد أقسام في قاعدة البيانات بعد. نفّذ supabase/seed/01_reference_data.sql.'
            : 'غير متاح — الخادم غير متصل',
        }}
      />
    </Card>
  );
}
