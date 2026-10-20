# packages/contract

`openapi.yaml` describes the API **shapes both surfaces agree on**: profiles, geography, the
service-category tree, listings, and the booking state machine. It is written before UI, and the
UI is derived from it.

## What is already true

- The spec exists and carries the honesty rule in its own text: `POST /rpc/create_booking_request`
  creates a request in status `pending` and **must never be rendered as a confirmed booking**.
- Schemas intentionally omit ratings and review counts. Those are server-computed later or absent;
  a client can never supply them.
- Endpoints not yet implemented are marked `x-status: planned` rather than deleted, so the gap is
  visible instead of silent.

## How clients get generated — the decision

Codegen is **not wired yet**, and it should not be wired the obvious way. Reason:

Supabase exposes the Postgres schema directly (PostgREST + RPC). `supabase gen types` produces
exact Dart and TypeScript row types from the live database, which is the only source of truth that
cannot drift. Generating a hand-authored OpenAPI client for CRUD would create a second,
hand-maintained copy of the same truth — the drift we are trying to avoid.

Plan:

| Concern | Source | Generated into |
| --- | --- | --- |
| Table row types (profiles, governorates, service_categories, listings) | `supabase gen types` once a project exists | `apps/web/src/lib/rows.ts` (replaces the hand-written version) and a Dart equivalent in `apps/mobile` |
| Booking workflow (`/rpc/create_booking_request`, state transitions, event log) | `openapi.yaml` | reviewed by hand on both sides until Phase 1, because it is behaviour, not shape |

Blocked on: a Supabase project existing. Until then nothing can be generated, and
`apps/web/src/lib/rows.ts` is labelled temporary.

## Tooling note

`openapi-typescript@7.13.0` requires `typescript ^5.x`; the portal is on TypeScript 6 (Vite 8
template). `@hey-api/openapi-ts@0.99.0` accepts `>=6.0.0` and is the one to use if a generated REST
client is ever needed here.
