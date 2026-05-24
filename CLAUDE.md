# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

pnpm + Turborepo monorepo with two apps and four shared packages.

- `apps/web` — Next.js 14 (App Router) frontend
- `apps/api` — NestJS 11 REST API
- `packages/types` — shared TypeScript types (`@repo/types`)
- `packages/ui` — shared React component library (`@repo/ui`)
- `packages/eslint-config` — shared ESLint configs
- `packages/typescript-config` — shared tsconfigs

## Commands

```bash
# Root (runs all apps via Turbo)
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format

# Target a specific app or package
turbo build --filter=@repo/types
turbo build --filter=api
turbo dev --filter=web

# API only
cd apps/api
pnpm start:dev       # watch mode
pnpm test            # jest
pnpm test:e2e        # jest e2e
pnpm seed            # ts-node prisma/seed.ts
pnpm prisma          # open Prisma Studio

# Web only
cd apps/web
pnpm dev             # next dev --turbo
pnpm test            # vitest run
pnpm test:watch      # vitest
pnpm test:e2e        # playwright
```

## Architecture

### Frontend (apps/web)

Follows **Feature-Sliced Design (FSD)** — enforced by Steiger. Layers in order of dependency:

```
app → widgets → features → entities → shared
```

Path aliases are configured for each layer (`@app`, `@widgets`, `@features`, `@entities`, `@shared`). Do not import upward (e.g. `entities` must not import from `features`).

State: Zustand for client state, TanStack Query for server state. Forms use React Hook Form + Zod.

### Backend (apps/api)

NestJS modular architecture. Each domain is a self-contained module under `src/`:
`auth`, `users`, `derivations`, `completed-derivation`, `users-groups`, `vehicle-documents`, `official-documents`, `habilitations`, `special-habilitations`, `market`, `chantiers`

Two databases:
- **PostgreSQL** via Prisma — relational data (users, derivations, market, chantier...)
- **MongoDB** via Mongoose — document data

JWT authentication with Passport.js. Swagger docs available at `/api` when running.

## Environment Variables

**apps/api/.env:**
```
DATABASE_POSTGRES_URL=
DATABASE_MONGO_URL=
JWT_SECRET=
PORT=3002
```

**apps/web/.env:**
```
NEXT_PUBLIC_API_URL=
JWT_SECRET=        # must match API
```

## Key Conventions

- Branch names and commits follow Conventional Commits (`feat`, `fix`, `chore`, `refactor`...)
- Branch names must be in English: `feat/short-description`
- Do not push directly to `main` or `develop`
- `@repo/types` must be built before `api` — already handled by `turbo.json` task order

## Language

All code, variable names, function names, comments, file names, and git artifacts (branches, commits, PR titles) must be in **English**. The only exception is user-facing displayed text (UI labels, messages shown to the user), which may be in French.

## FSD Architecture (apps/web)

Every file must live in the correct FSD layer and be split into proper **slices** and **segments**:

```
shared/          → reusable utilities, UI kit, types, API clients (no business logic)
entities/        → business entities (model, api, ui segments)
features/        → user interactions that change state (model, api, ui segments)
widgets/         → composite blocks assembling entities + features
app/             → providers, routing, global styles
```

Standard segments inside each slice: `ui/`, `model/`, `api/`, `lib/`, `config/`.

- Never put business logic in `ui` segments
- Never import from a higher layer (e.g. `entities` must not import from `features`)
- Cross-slice imports within the same layer are forbidden — use `shared` instead
- Steiger enforces these rules — fix all violations before committing

## Library Best Practices

Always follow each library's own conventions. Consult their llms.txt for up-to-date guidance before working with them:

- **Zod** — `https://zod.dev/llms.txt` — define schemas once in `shared/` or `entities/`, infer types with `z.infer<>`, never duplicate manual TypeScript types alongside a Zod schema
- **React Hook Form** — `https://react-hook-form.com/llms.txt` — always use `zodResolver`, keep `defaultValues` typed, use `Controller` for controlled components, avoid uncontrolled refs
- **TanStack Query** — `https://tanstack.com/query/latest/llms.txt` — colocate query keys with their fetcher in `api` segments, use `queryOptions` helper, never fetch inside components directly
- **Next.js** — `https://nextjs.org/llms.txt` — prefer Server Components by default, use `"use client"` only when necessary, use App Router conventions
- **NestJS** — `https://docs.nestjs.com/llms.txt` — one module per domain, use Guards for auth, Pipes for validation, DTOs with class-validator decorators
- **Prisma** — `https://www.prisma.io/docs/llms.txt` — always run `prisma generate` after schema changes, use transactions for multi-step writes, never expose Prisma models directly to API responses (use DTOs)
- **Zustand** — keep stores small and scoped per feature slice, never use a global god-store

## Security

- Never expose secrets or env variables to the frontend (`NEXT_PUBLIC_` prefix only for truly public values)
- Validate all inputs at API boundaries using class-validator DTOs on the NestJS side and Zod on the frontend
- Use Prisma parameterized queries only — never raw string interpolation in DB queries
- JWT secrets must never be committed — use `.env` files which are gitignored
- Sanitize all user-generated content before rendering to prevent XSS
- Apply authentication guards on all protected NestJS routes
- Never trust client-side data for authorization decisions — always verify server-side
