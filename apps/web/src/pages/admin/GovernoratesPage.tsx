import { useState } from 'react';
import { Alert, Button, Card, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useList } from '@refinedev/core';
import { AdminRecordModal, type AdminField } from '../../components/AdminRecordModal';
import { backendConfigured } from '../../lib/backend';
import type { AreaRow, GovernorateRow } from '../../lib/rows';
import { tokens } from '../../lib/tokens';

const governorateFields: AdminField[] = [
  { kind: 'text', name: 'name_ar', label: 'اسم المحافظة', required: true },
  { kind: 'text', name: 'name_en', label: 'الاسم بالإنجليزية', latin: true },
  { kind: 'text', name: 'code', label: 'الرمز (اختياري)', latin: true },
  { kind: 'number', name: 'sort_order', label: 'الترتيب', required: true, min: 1, max: 999 },
  { kind: 'switch', name: 'active', label: 'مفعّلة' },
];

const areaFields = (options: { value: number; label: string }[]): AdminField[] => [
  { kind: 'select', name: 'governorate_id', label: 'المحافظة', required: true, options },
  { kind: 'text', name: 'name_ar', label: 'اسم المنطقة', required: true },
  { kind: 'text', name: 'name_en', label: 'الاسم بالإنجليزية', latin: true },
  { kind: 'switch', name: 'active', label: 'مفعّلة' },
];

const activeTag = (active: boolean) =>
  active ? <Tag color="success">مفعّل</Tag> : <Tag color="default">موقوف</Tag>;

const optionalText = (value: string | null, latin = false) =>
  value ? <span dir={latin ? 'ltr' : undefined}>{value}</span> : <Typography.Text type="secondary">—</Typography.Text>;

export function GovernoratesPage() {
  const governorates = useList<GovernorateRow>({
    resource: 'governorates',
    pagination: { pageSize: 50 },
    sorters: [{ field: 'sort_order', order: 'asc' }],
    queryOptions: { enabled: backendConfigured },
  });

  const [governorateForm, setGovernorateForm] = useState<{ record: GovernorateRow | null } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [areaForm, setAreaForm] = useState<{ record: AreaRow | null } | null>(null);

  const rows = governorates.result?.data ?? [];
  const options = rows.map((row) => ({ value: row.id, label: row.name_ar }));
  const shownGovernorate = selected ?? rows[0]?.id ?? null;

  const areas = useList<AreaRow>({
    resource: 'areas',
    filters: [{ field: 'governorate_id', operator: 'eq', value: shownGovernorate ?? -1 }],
    pagination: { pageSize: 200 },
    sorters: [{ field: 'name_ar', order: 'asc' }],
    queryOptions: { enabled: backendConfigured && shownGovernorate !== null },
  });

  const governorateColumns: ColumnsType<GovernorateRow> = [
    { title: 'المحافظة', dataIndex: 'name_ar', key: 'name_ar' },
    { title: 'الاسم بالإنجليزية', dataIndex: 'name_en', key: 'name_en', render: (value: string | null) => optionalText(value, true) },
    {
      title: 'الرمز',
      dataIndex: 'code',
      key: 'code',
      width: 110,
      render: (value: string | null) => (value ? <Typography.Text code dir="ltr">{value}</Typography.Text> : '—'),
    },
    { title: 'الحالة', dataIndex: 'active', key: 'active', width: 110, render: activeTag },
    {
      title: '',
      key: 'edit',
      width: 90,
      render: (_value, row) => (
        <Button size="small" onClick={() => setGovernorateForm({ record: row })}>
          تعديل
        </Button>
      ),
    },
  ];

  const areaColumns: ColumnsType<AreaRow> = [
    { title: 'المنطقة', dataIndex: 'name_ar', key: 'name_ar' },
    { title: 'الاسم بالإنجليزية', dataIndex: 'name_en', key: 'name_en', render: (value: string | null) => optionalText(value, true) },
    { title: 'الحالة', dataIndex: 'active', key: 'active', width: 110, render: activeTag },
    {
      title: '',
      key: 'edit',
      width: 90,
      render: (_value, row) => (
        <Button size="small" onClick={() => setAreaForm({ record: row })}>
          تعديل
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={tokens.space.lg} style={{ width: '100%' }}>
      <Card
        title="المحافظات"
        extra={
          <Button type="primary" disabled={!backendConfigured} onClick={() => setGovernorateForm({ record: null })}>
            إضافة محافظة
          </Button>
        }
        styles={{ body: { paddingBlockStart: 0 } }}
      >
        <Typography.Paragraph type="secondary">
          بيانات جغرافية حقيقية لمصر، وليست بيانات تجريبية. أي حفظ هنا يروح للسيرفر مباشرة، والسيرفر
          هو اللي بيرفض أو يقبل — ليس هذه الشاشة.
        </Typography.Paragraph>

        {governorates.query.isError && backendConfigured && (
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
          columns={governorateColumns}
          dataSource={rows}
          loading={governorates.query.isLoading && backendConfigured}
          pagination={false}
          scroll={{ x: 'max-content' }}
          onRow={(row) => ({ onClick: () => setSelected(row.id) })}
          locale={{
            emptyText: backendConfigured
              ? 'لا توجد محافظات بعد. نفّذ supabase/seed/01_reference_data.sql.'
              : 'غير متاح — الخادم غير متصل',
          }}
        />
      </Card>

      <Card
        title="المناطق"
        extra={
          <Space>
            <Select
              value={shownGovernorate ?? undefined}
              options={options}
              placeholder="اختار محافظة"
              style={{ minWidth: 220 }}
              onChange={(value) => setSelected(value)}
              disabled={!backendConfigured || options.length === 0}
            />
            <Button
              type="primary"
              disabled={shownGovernorate === null}
              onClick={() => setAreaForm({ record: null })}
            >
              إضافة منطقة
            </Button>
          </Space>
        }
        styles={{ body: { paddingBlockStart: 0 } }}
      >
        {areas.query.isError && backendConfigured && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: tokens.space.md }}
            message="تعذّر تحميل المناطق"
            description="تحقّق من سياسة الوصول على جدول areas."
          />
        )}

        <Table<AreaRow>
          rowKey="id"
          columns={areaColumns}
          dataSource={areas.result?.data ?? []}
          loading={areas.query.isLoading && backendConfigured && shownGovernorate !== null}
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: shownGovernorate === null ? 'اختار محافظة الأول.' : 'مافيش مناطق مسجّلة في المحافظة دي لسه.',
          }}
        />
      </Card>

      <AdminRecordModal
        resource="governorates"
        title={governorateForm?.record ? 'تعديل محافظة' : 'إضافة محافظة'}
        fields={governorateFields}
        record={governorateForm?.record ?? null}
        open={governorateForm !== null}
        onClose={() => setGovernorateForm(null)}
      />

      <AdminRecordModal
        resource="areas"
        title={areaForm?.record ? 'تعديل منطقة' : 'إضافة منطقة'}
        fields={areaFields(options)}
        record={areaForm?.record ?? null}
        prefill={shownGovernorate === null ? undefined : { governorate_id: shownGovernorate }}
        open={areaForm !== null}
        onClose={() => setAreaForm(null)}
      />
    </Space>
  );
}
