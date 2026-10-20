import type { DataProvider } from '@refinedev/core';
import { dataProvider as supabaseDataProvider } from '@refinedev/supabase';
import { supabase } from './backend';

function unavailable(): never {
  throw new Error(
    'أدلة البيانات معطّلة لأن مشروع Supabase غير متصل. لا يجوز طلب بيانات حقيقية في هذه الحالة.',
  );
}

/**
 * Used only while `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are missing.
 * Every method throws on purpose: a silent empty result would read as
 * "the database has no rows", which is a claim we cannot make.
 */
const offlineDataProvider = {
  getList: unavailable,
  getMany: unavailable,
  getManyReferences: unavailable,
  create: unavailable,
  update: unavailable,
  deleteOne: unavailable,
  custom: unavailable,
} as unknown as DataProvider;

export const dataProvider: DataProvider = supabase
  ? supabaseDataProvider(supabase)
  : offlineDataProvider;
