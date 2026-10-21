import { useState } from 'react';
import { Alert, Button, Card, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useList } from '@refinedev/core';
import { AdminRecordModal, type AdminField } from '../../components/AdminRecordModal';
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

/** Keys `E7Category.iconForKey` in the mobile app already knows. A new key
 *  still renders there (it falls back), but the admin only picks known ones. */
const iconOptions = [
  { value: 'restaurant', label: 'مطعم' },
  { value: 'sports', label: 'رياضة' },
  { value: 'beauty', label: 'تجميل' },
  { value: 'health', label: 'صحة' },
  { value: 'home', label: 'منزل' },
  { value: 'events', label: 'مناسبات' },
  { value: 'travel', label: 'سفر' },
];

export function CategoriesPage() {
  const { result, query } = useList<ServiceCategoryRow>({
    resource: 'service_categories',
    pagination: { pageSize: 200 },
    sorters: [{ field: 'sort_order', order: 'asc' }],
    queryOptions: { enabled: backendConfigured },
  });

  const [form, setForm] = useState<{ record: ServiceCategoryRow | null } | null>(null);

  const rows = result?.data ?? [];
  const tree = buildTree(rows);

  const parentOptions = rows
    .filter((row) => row.parent_id === null && row.id !== form?.record?.id)
    .map((row) => ({ value: row.id, label: row.name_ar }));

  const fields: AdminField[] = [
    { kind: 'text', name: 'name_ar', label: 'الاسم بالعربي', required: true },
    {
      kind: 'text',
      name: 'slug',
      label: 'المعرّف اللاتيني (بيظهر في روابط الصفحات)',
      required: true,
      latin: true,
      disabled: form?.record != null,
    },
    { kind: 'text', name: 'name_en', label: 'الاسم بالإنجليزية', latin: true },
    { kind: 'textarea', name: 'description_ar', label: 'الوصف القصير' },
    { kind: 'select', name: 'icon', label: 'الأيقونة', options: iconOptions, noneLabel: 'بدون أيقونة' },
    { kind: 'select', name: 'parent_id', label: 'الأب', options: parentOptions, noneLabel: 'قطاع رئيسي (بدون أب)' },
    { kind: 'number', name: 'sort_order', label: 'الترتيب', required: true, min: 1, max: 999 },
    { kind: 'switch', name: 'active', label: 'مفعّل' },
  ];

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
    {
      title: '',
      key: 'edit',
      width: 90,
      render: (_value, row) => (
        <Button size="small" onClick={() => setForm({ record: row })}>
          تعديل
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="أقسام الخدمات"
      extra={
        <Button type="primary" disabled={!backendConfigured} onClick={() => setForm({ record: null })}>
          إضافة قسم
        </Button>
      }
      styles={{ body: { paddingBlockStart: 0 } }}
    >
      <Typography.Paragraph type="secondary">
        الشجرة قابلة للتوسّع: الجذور هي قطاعات الإطلاق، والأبناء خدمات فرعية. الإضافة والتعديل هنا
        بيتخزّنوا في قاعدة البيانات عن طريق السيرفر، من غير تعديل في الكود. عمود العمق بيحسبه السيرفر
        لوحده من الأب، مافيش خانة له في النافذة دي.
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

      <AdminRecordModal
        resource="service_categories"
        title={form?.record ? 'تعديل قسم' : 'إضافة قسم'}
        fields={fields}
        record={form?.record ?? null}
        open={form !== null}
        onClose={() => setForm(null)}
      />
    </Card>
  );
}
