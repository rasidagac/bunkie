# Implementation Plan: Route-level Go Back Functionality

**Branch**: `003-route-back-nav` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-route-back-nav/spec.md`

## Summary

Add a single, predictable back affordance to every non–top-level authenticated route so users can return to a logical parent without relying on browser chrome. UI-only feature: shared `BackButton` component plugs into existing breadcrumb/header areas, prefers `router.back()` when in-app history exists, and falls back to a static parent-route map when entering via deep link. Modal routes close instead of going one step further back.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), React 19, Next.js 16.1.7 (App Router, Turbopack)
**Primary Dependencies**: `next/navigation`, shadcn/ui (`@ui/button`, icons via `lucide-react`), Tailwind CSS v4
**Storage**: N/A (no persistence; UI affordance only)
**Testing**: Existing project conventions — component tests colocated `*.test.tsx`; manual UX verification per Constitution §II
**Target Platform**: Web (mobile-first, responsive); same browser support as rest of app
**Project Type**: Single Next.js web app (App Router, route groups `(public)` and `(protected)`)
**Performance Goals**: Zero added LCP cost — back control is part of existing header SSR. Interaction latency well below 200 ms INP target (`router.back()` is local).
**Constraints**: Server Component default; new client boundary only inside the `BackButton` itself for `useRouter`/`window.history` access. Bundle delta target < 2 KB gzip.
**Scale/Scope**: ~5 affected route segments (`/groups/[id]`, `/groups/[id]/expenses/[expenseId]`, `/groups/[id]/expenses`, `/groups/[id]/create`, intercepted modals under `@modal`). Top-level routes (`/groups`, `/auth/*`) excluded.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Code Quality** | PASS | TS strict; `import type` used; alphabetic imports; path aliases (`@ui/`, `@/components/...`); no money types touched; new component lives under `src/components/common/` (shared primitive). No backwards-compat shims. |
| **II. Testing Standards** | PASS | Component-level unit test for fallback logic (history empty → static parent); UI test for keyboard activation + screen-reader label; modal back-closes-modal test. No DB tests required (no data path). |
| **III. UX Consistency** | PASS | Built from shadcn/ui `Button` + `lucide-react` icon; Tailwind via Prettier plugin (no manual class ordering). Toast subsystem untouched. Hidden on top-level routes (FR-003). Dark/light mode covered by inheriting `Button` variants. No destructive action — confirmation rule N/A. |
| **IV. Performance** | PASS | Server Components remain default; only the `BackButton` itself is `"use client"` (justified: requires `useRouter` + `window.history.length`). No new server fetches, no Redux state, no images. Bundle delta < 2 KB gzip. |

**Outcome**: All gates pass; no Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/003-route-back-nav/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — UI only)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A — no external interfaces)
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (protected)/
│   │   └── groups/
│   │       ├── [id]/
│   │       │   ├── page.tsx              # Host BackButton in header
│   │       │   ├── create/page.tsx       # Host BackButton in header
│   │       │   ├── expenses/
│   │       │   │   ├── page.tsx          # Host BackButton in header
│   │       │   │   └── [expenseId]/
│   │       │   │       └── page.tsx      # Host BackButton in header
│   │       └── @modal/                   # Modal slot — modal back closes overlay
│   └── (public)/                         # Excluded — top-level
├── components/
│   ├── common/
│   │   └── back-button.tsx               # NEW: client component, single source of truth
│   └── features/
│       └── group/
│           ├── group-breadcrumb.tsx      # Mount BackButton beside breadcrumb
│           └── house-header.tsx          # Mount BackButton in group header
└── lib/
    └── parent-routes.ts                  # NEW: pathname → parent fallback map
```

**Structure Decision**: Single Next.js app (existing layout). New shared component lives under `src/components/common/` per constitution §I (one place per primitive). Pathname → parent-route mapping isolated in `src/lib/parent-routes.ts` to keep `BackButton` purely presentational.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

No violations. Section intentionally empty.
