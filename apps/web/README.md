# apps/web — provider & admin portal

**This is not the customer product.** The customer product is `apps/mobile` (Flutter).
This portal is the back-office: Supabase-backed admin screens (Refine + Ant Design) and,
later, the provider dashboard.

Arabic-first and RTL: `<html lang="ar" dir="rtl">`, `ConfigProvider direction="rtl"`,
`antd/locale/ar_EG`, and brand values imported from `packages/tokens/tokens.json` — never
re-typed here.

## Run

```bash
cd apps/web
npm install
cp .env.example .env.local     # fill in your Supabase project values
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` then production bundle into `dist/` |
| `npm run lint` | oxlint |

## Environment

| Variable | Meaning |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL. Empty ⇒ portal is read-only and shows the "الخادم غير متصل" notice. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (public by design, still env-only). |
| `VITE_PORTAL_PREVIEW` | `1` in dev only. Renders the shell without a backend so the RTL chrome can be reviewed. Never true in a production build. |

## What works today

- RTL Arabic shell: right-side navigation, brand theme, Cairo/IBM Plex Sans Arabic, ar-EG locale.
- Session + role gate from `profiles` and `account_roles` (admin / provider / customer).
- `service_categories` tree (read-only) and `governorates` (read-only) from real migrations + seed.
- Login by email magic link (requires a connected Supabase project).
- Navigation and filters do what they claim. Planned screens are **disabled menu items labelled
  «لاحقًا»**, not dead buttons.

## Deliberately absent

Provider listings, booking state machine, account management, and any create/edit form. Their
tables show `غير متاح — الخادم غير متصل` rather than an empty list, because an empty list would
claim "the database has zero rows" — a statement we cannot make offline. No demo providers,
prices, ratings, or availability exist in this portal.

## Layout of `src/`

```
lib/backend.ts       nullable Supabase client + backendConfigured
lib/dataProvider.ts  Refine data provider; offline stub throws on purpose
lib/auth.tsx         session, roles, dev-preview escape hatch
lib/tokens.ts        reads packages/tokens, formats EGP + ar-EG dates
lib/rows.ts          row types — temporary; replaced by `supabase gen types` (see packages/contract/README.md)
components/          AppLayout, PortalGate, RequireRole, BackendNotice
pages/admin/         Overview, Categories, Governorates
pages/provider/      ProviderHomePage (placeholder state)
routes.tsx           createBrowserRouter tree with resource definitions
```
