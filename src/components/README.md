# Components Directory Structure

This directory follows a structured approach for organizing React components in our Next.js 15 application.

## Directory Structure

- `/ui/` - Reusable UI components (Shadcn UI, Radix UI components)
- `/features/` - Feature-specific components organized by domain
  - `/features/auth/` - Authentication related components
  - `/features/expense/` - Expense management components
  - `/features/group/` - Group management components
- `/layout/` - Layout components like sidebar, navigation, etc.
- `/providers/` - Context providers and wrappers
- `/common/` - Shared components used across multiple features

## Component Guidelines

1. Favor React Server Components (RSC) where possible
2. Minimize 'use client' directives
3. Use Suspense for async operations
4. Implement proper error boundaries
5. Follow UI styling conventions with Shadcn UI, Radix UI, and Tailwind CSS
6. Use declarative JSX and mobile-first responsive design

## Naming Conventions

- Use kebab-case for file names
- Use PascalCase for component names
- Suffix context providers with `Provider` (e.g., `ThemeProvider`)
- Suffix hooks with `use` prefix (e.g., `useTheme`) 