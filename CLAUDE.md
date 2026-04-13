# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js with Node --inspect for debugging)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm update-types # Regenerate Supabase TypeScript types (requires PROJECT_REF env var)
```

## Architecture

**Bunkie** is a shared house expense tracker. Stack: Next.js 16 App Router, TypeScript, Supabase (auth + data), Tailwind CSS v4, shadcn/ui (New York style), React Hook Form + Zod, Redux Toolkit.

### Route structure

- `src/app/(public)/` — unauthenticated pages (landing, auth flows)
- `src/app/(protected)/` — authenticated pages; uses a `@modal` parallel route for intercepted modals
- `src/app/auth/` — Supabase auth callbacks and login/sign-up pages
- Middleware (`src/utils/supabase/middleware.ts`) guards `protectedRoutes` and redirects unauthenticated users to `/auth/login`

### Server vs. client

- **Server actions** live in `src/actions/{feature}/` and must start with `"use server"`. They use `src/utils/supabase/server.ts` (cookie-aware).
- **Browser components** use `src/utils/supabase/client.ts` (`NEXT_PUBLIC_*` keys only). Never call the browser client from server code.
- `src/app/layout.tsx` mounts the global `ThemeProvider` and `Toaster`. Feature providers go here or in `src/components/providers/`.

### Path aliases (tsconfig)

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `@lib/*` | `src/lib/*` |
| `@ui/*` | `src/components/ui/*` |
| `@actions/*` | `src/actions/*` |

shadcn components live at `src/components/ui/` and are imported via `@ui/`. Feature components are in `src/components/features/`, shared primitives in `src/components/common/`.

### Database types

Generated types are at `src/database.types.ts` (excluded from lint). Regenerate after schema changes with `pnpm update-types`.

## Database schema (Supabase project: `gthhgpebwbpkscaxmaqt`)

All tables have RLS enabled.

### Tables

**`profiles`** — mirrors `auth.users`; created automatically by the `handle_new_user` trigger on signup.
- `id` (uuid, PK → `auth.users.id`), `email` (unique), `username` (unique, ≥3 chars), `full_name`, `avatar_url`, `is_active` (default true), `created_at`, `updated_at`

**`groups`** — a shared house/group.
- `id` (uuid, PK), `name`, `code` (unique, auto-generated 8-char string used to invite members), `created_at`

**`memberships`** — join table linking `profiles` ↔ `groups`.
- `id`, `group_id` → `groups.id`, `user_id` → `profiles.id`, `created_at`

**`expenses`** — an expense paid by one user on behalf of the group.
- `id` (uuid, PK), `title`, `amount`, `user_id` (payer → `profiles.id`), `group_id` → `groups.id`, `image_url` (nullable), `created_at`
- `currency`: enum `TRY | USD | EUR` (default `TRY`)
- `split_type`: enum `equal | custom | percentage` (default `equal`)

**`expense_splits`** — how an expense is divided among group members.
- `id` (uuid, PK), `expense_id` → `expenses.id`, `user_id` → `profiles.id`, `amount`, `percentage` (nullable), `is_settled` (default false)
- When `split_type = 'equal'`, the `insert_expense_splits` trigger auto-creates one row per group member dividing `expenses.amount` evenly.

**`payments`** — direct settlement payments between two group members.
- `id` (uuid, PK), `payer_id` → `profiles.id`, `receiver_id` → `profiles.id`, `group_id` → `groups.id`, `amount`, `currency` (enum, default `TRY`), `created_at`

### Views

**`group_balances`** — net balance per `(group_id, user_id)`. Aggregates expense splits and payments. A negative balance means the user has paid more than they owe (creditor); positive means they still owe money (debtor). This is the primary source for debt calculations.

**`group_transactions`** — unified timeline of expenses and payments. Each expense row includes participant details and a `role` field: `payer`, `creditor`, `debtor`, or `payment`. Use this view to display activity feeds.

**`user_balances`** — simplified debtor/creditor amounts per group derived from `expense_splits` only (does not account for payments). Lower-level than `group_balances`.

### Triggers / functions

- `handle_new_user` — fires on `auth.users` INSERT; inserts a row into `profiles` using `raw_user_meta_data` (populates `full_name`, `username`, `avatar_url`).
- `insert_expense_splits` — fires after `expenses` INSERT; if `split_type = 'equal'`, creates `expense_splits` rows for every group member automatically.

### RLS policy summary

| Table | Notable rules |
|---|---|
| `profiles` | SELECT public; INSERT/UPDATE own row only |
| `groups` | SELECT all authenticated; UPDATE/DELETE members only |
| `memberships` | SELECT all authenticated |
| `expenses` | All operations for any authenticated user (permissive) |
| `expense_splits` | INSERT authenticated; SELECT if involved or group member |
| `payments` | SELECT if payer, receiver, or group member |

## Key conventions

- **Imports**: ESLint enforces `@typescript-eslint/consistent-type-imports` — always use `import type` for type-only imports.
- **Sorting**: `eslint-plugin-perfectionist` enforces alphabetical import ordering.
- **Formatting**: Prettier with `prettier-plugin-tailwindcss` for class ordering. Run `pnpm lint` to catch both.
- **New protected routes**: Add paths to `protectedRoutes` in `src/utils/supabase/middleware.ts`.
- **File uploads**: Handled via `src/actions/upload/uploadFile.ts` using Vercel Blob (`@vercel/blob`). Images served from `42zkrqfpvlu9uaa6.public.blob.vercel-storage.com`.

## Environment variables

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes — both middleware and client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes — both middleware and client |
| `PROJECT_REF` | Only for `pnpm update-types` |
