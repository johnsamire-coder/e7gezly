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
  if (/categories_slug_shape/i.test(raw))
    return 'المعرّف لازم يكون حروف إنجليزية صغيرة وأرقام، وفواصل "-" بينها (زي: home-services).';
  if (/row-level security|policy/i.test(raw))
    return 'السيرفر رفض الكتابة: حسابك مافيهوش صلاحية التعديل على هذا الجدول.';
  if (/violates check constraint/i.test(raw)) return 'القيمة لا تطابق قواعد التحقق المكتوبة في قاعدة البيانات.';
  if (/violates foreign key/i.test(raw)) return 'العنصر المرتبط بيه موجودش أو اتغيّر.';
  if (/violates not-null constraint/i.test(raw)) return 'الخانة دي مطلوبة في قاعدة البيانات، والقيمة اللي بعتها فاضية.';
  if (/permission denied/i.test(raw)) return 'السيرفر رفض الكتابة: الحساب ده ما عنوش صلاحية على هذا الجدول أصلًا.';
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

/** `latin` boxes are the ones that end up as identifiers or links, so Arabic typed into
 *  them is caught here instead of being stored and rejected by the server later. */
function fieldRules(field: AdminField) {
  const rules: { required?: boolean; pattern?: RegExp; message: string }[] = [];
  if ('required' in field && field.required) rules.push({ required: true, message: `${field.label} مطلوب` });
  if (field.kind === 'text' && field.latin)
    rules.push({ pattern: /^[^\u0600-\u06FF]*$/, message: 'الخانة دي بالأحرف اللاتينية، مش بالعربي.' });
  return rules.length > 0 ? rules : undefined;
}

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
    for (const field of fields) {
      const value = values[field.name];
      // An untouched optional box must not store an empty string: Postgres keeps '' as a
      // real value, so every later "does this row have a name in English" answer is wrong.
      payload[field.name] = typeof value === 'string' && value.trim() === '' ? null : (value ?? null);
    }
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
            rules={fieldRules(field)}
          >
            {control(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
