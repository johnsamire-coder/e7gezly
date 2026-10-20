# احجزلي · E7gezly

Arabic-first booking marketplace for Egypt.

## Product shape

| Surface | Tech | Who uses it |
| --- | --- | --- |
| `apps/mobile` | Flutter (Android + iOS) | **Customers — this is the main product** |
| `apps/web` | Refine + Ant Design | Service providers + admins (role-gated) |
| `supabase/` | Postgres, Auth, Storage, RLS | Backend for both |

A responsive website is **not** the mobile app. The mobile app is the customer product.

## Layout

```
apps/
  mobile/        Flutter customer app (RTL, Arabic-first)
  web/           Provider portal + admin dashboard
packages/
  contract/      OpenAPI spec + generated Dart/TS clients — single source of truth
  tokens/        Brand colours, spacing, typography shared by both surfaces
  content/       Arabic UI strings (not created yet)
supabase/
  migrations/    Schema, in order
  seed/          Real reference data (governorates, launch taxonomy) — not demo listings
archive/         Pre-Foundation React prototypes (reference only, not built)
```

## Ground rules

1. `packages/contract` is authored first; UI on either side is generated or derived from it. Never hand-copy types.
2. Both surfaces read design values from `packages/tokens`. Divergent colours or radii are bugs.
3. Demo data must always announce itself. No fake provider, rating, price, or availability may render as real.
4. Booking workflows are modelled as state transitions with an event log from day one — no boolean "isBooked".
5. Payments and the AI assistant are later phases. Schema leaves room for them; UI never implies they exist.

## Status

Full phased plan with acceptance criteria: [`PLAN.md`](PLAN.md) (Arabic).

Phase 0 (foundation) and Phase 1 (brand + visual system) are done; Phase 2 (real data) is next and
needs your Supabase project. Nothing is deployed and nothing is published — the code lives in
a public GitHub repository only: `github.com/johnsamire-coder/e7gezly`.

| Step | State |
| --- | --- |
| Monorepo + archive of the two prototypes | done |
| Android toolchain (SDK licenses accepted) | done |
| `packages/tokens` | written; consumed by both surfaces. Now also the single source for the brand mark |
| `tools/make-icons.ps1` + Phase 1 brand assets | generated 43 files (Android densities + adaptive layers + splash, iOS app icons + launch images, web favicon); APK rebuilt and verified with `aapt`. No stock template artwork left |
| `supabase/migrations` 0001–0002 + seed | written, **not applied** — needs your Supabase project |
| `packages/contract/openapi.yaml` | written, codegen not configured yet |
| `apps/mobile` | Flutter shell: `flutter analyze` clean, 36 tests pass (30 of them layout checks across 5 screen sizes × 6 routes), `flutter build apk --debug` ok (label `احجزلي`) |
| `apps/web` | Refine + Ant Design RTL portal: `tsc -b` clean, `vite build` ok, oxlint 0 errors |
| `tools/make-tokens-dart.ps1` | regenerates `apps/mobile/lib/core/tokens.dart` from the token file; `ci.yml` runs it with `-Check`, so a hand edit fails the build |
| CI | `ci.yml` green on GitHub (run #1: portal + Flutter app). `ios.yml` written, never run — needs an Apple Developer account |

Blocked on you: creating the Supabase account/project (I don't sign you up), and choosing the OTP
provider for phone login (Twilio vs WhatsApp Business).
