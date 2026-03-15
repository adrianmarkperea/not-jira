# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version Notes

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier (write)
pnpm test         # Vitest (unit/component)
pnpm test:e2e     # Playwright (E2E) — requires dev server running
```

Run a single unit test:

```bash
pnpm vitest run app/page.test.tsx
```

Run a single E2E test:

```bash
pnpm exec playwright test e2e/home.spec.ts
```

### Local Supabase

```bash
pnpx supabase start    # Start local Supabase (Docker required)
pnpx supabase stop     # Stop local Supabase
pnpx supabase db reset # Re-run all migrations
```

## Architecture

**Stack:** Next.js (v16 canary) App Router · React 19 · Supabase (Postgres + Auth) · Tailwind CSS v4 · TypeScript

**Key directories:**

- `app/` — App Router pages and layouts. Protected routes live under `app/protected/`.
- `actions/` — Server Actions.
- `components/` — Shared React components.
- `lib/supabase/` — Supabase client helpers for server and browser contexts.
- `lib/database.types.ts` — Auto-generated TypeScript types from Supabase schema. Regenerate with `supabase gen types typescript`.
- `supabase/migrations/` — SQL migrations applied via `supabase db reset` or `supabase migration up`.
- `e2e/` — Playwright end-to-end tests.

**Auth pattern:** Uses `@supabase/ssr`. Middleware handles session refresh and route protection. Server Components use the server Supabase client; Client Components use the browser client.

**Environment variables** (in `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<from supabase start output>
```
