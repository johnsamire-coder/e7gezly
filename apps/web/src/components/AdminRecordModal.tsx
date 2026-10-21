import { useState } from 'react';
import { Alert, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { useCreate, useUpdate } from '@refinedev/core';
import { tokens } from '../lib/tokens';

export type AdminField =
  | { kind: 'text'; name: string; label: string; required?: boolean; latin?: boolean; disabled?: boolean }
  | { kind: 'textarea'; name: string; label: string; required?: boolean }
  | { kind: 'number'; name: string; label: string; min?: number; max?: number; required?: boolean }
  | { kind: 'switch'; name: string; label: string }
  | {
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      options: { value: string | number; label: string }[];
      noneLabel?: string;
    };

type Props = {
  resource: string;
  title: string;
  fields: AdminField[];
  /** null means "add a new row". */
  record: Record<string, unknown> | null;
  /** Values an added row starts with — used for a parent id the page already knows. */
  prefill?: Record<string, unknown>;
  open: boolean;
  onClose: () => void;
};

/**
 * The database is the authority, so a rejected write is reported with the
 * server's own reason translated — never as a success the row never earned.
 */
function explain(error: unknown): string {
  const raw =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message ?? '')
      : '';
  if (/duplicate key/i.test(raw)) return 'القيمة دي موجودة بالفعل في قاعدة البيانات، وممنوع التكرار.';
  if (/row-level security|policy/i.test(raw))
    return 'السيرفر رفض الكتابة: حسابك مافيهوش صلاحية التعديل على هذا الجدول.';
  if (/violates check constraint/i.test(raw)) return 'القيمة لا تطابق قواعد التحقق المكتوبة في قاعدة البيانات.';
  if (/violates foreign key/i.test(raw)) return 'العنصر المرتبط بيه موجودش أو اتغيّر.';
  return raw || 'الحفظ فشل لسبب غير متوقع.';
}

function control(field: AdminField) {
  switch (field.kind) {
    case 'text':
      return <Input dir={field.latin ? 'ltr' : 'rtl'} disabled={field.disabled} />;
    case 'textarea':
      return <Input.TextArea rows={3} />;
    case 'number':
      return <InputNumber min={field.min} max={field.max} style={{ width: '100%' }} />;
    case 'switch':
      return <Switch />;
    case 'select':
      return (
        <Select
          options={field.options}
          allowClear={!field.required}
          placeholder={field.noneLabel ?? (field.required ? undefined : 'بدون')}
        />
      );
  }
}

type FormValues = Record<string, string | number | boolean | null | undefined>;

export function AdminRecordModal({ resource, title, fields, record, prefill, open, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const create = useCreate();
  const update = useUpdate();

  const startValues = (): FormValues =>
    (record as FormValues | null) ??
    ({
      ...Object.fromEntries(fields.map((field) => [field.name, field.kind === 'switch' ? true : undefined])),
      ...prefill,
    } as FormValues);

  const submit = async () => {
    const values = await form.validateFields();
    const payload: Record<string, unknown> = {};
    for (const field of fields) payload[field.name] = values[field.name] ?? null;
    setError(null);
    setSaving(true);
    try {
      if (record) {
        await update.mutateAsync({ resource, id: record.id as number, values: payload });
      } else {
        await create.mutateAsync({ resource, values: payload });
      }
      onClose();
    } catch (cause) {
      setError(explain(cause));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      onOk={() => void submit()}
      okText={record ? 'حفظ التعديل' : 'إضافة'}
      cancelText="إلغاء"
      okButtonProps={{ loading: saving }}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          setError(null);
          form.setFieldsValue(startValues());
        }
      }}
    >
      {error && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: tokens.space.md }}
          message="السيرفر رفض الحفظ"
          description={error}
        />
      )}
      <Form form={form} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            valuePropName={field.kind === 'switch' ? 'checked' : 'value'}
            rules={'required' in field && field.required ? [{ required: true, message: `${field.label} مطلوب` }] : undefined}
          >
            {control(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
