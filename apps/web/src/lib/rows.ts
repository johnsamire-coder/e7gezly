/**
 * Row shapes matching supabase/migrations. Temporary: these become generated
 * types from packages/contract once codegen lands (Phase 0.6).
 */

export type ServiceCategoryRow = {
  id: number;
  parent_id: number | null;
  slug: string;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  icon: string | null;
  sort_order: number;
  depth: number;
  active: boolean;
};

export type GovernorateRow = {
  id: number;
  name_ar: string;
  name_en: string | null;
  code: string | null;
  sort_order: number;
  active: boolean;
};

export type AccountRoleRow = {
  account_id: string;
  role: 'customer' | 'provider' | 'admin';
};
