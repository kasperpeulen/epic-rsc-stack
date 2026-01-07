# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goal

Port the [Epic Stack](https://github.com/epicweb-dev/epic-stack) to modern patterns and tooling. The project is **complete when all Epic Stack features are ported** (routes, auth flows, CRUD, RBAC) using latest best practices.

Fresh designs welcome - no pixel-perfect replication needed.

Reference implementation: `../epic-stack-reference`

## Modern Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun |
| Framework | React Router v7 + React 19 RSC |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Database | SQLite + Drizzle ORM + LiteFS |
| Auth | @simplewebauthn, @node-rs/argon2, @epic-web/totp |
| Validation | Zod + Conform |
| Testing | Playwright (E2E), Vitest (unit) |
| Linting | oxlint |
| Formatting | oxfmt |
| Deployment | Fly.io with branch deployments |
| Monitoring | Sentry |
| Email | Resend |
| AI | Claude Code |

## Commands

```bash
bun run dev        # Start dev server at http://localhost:5173
bun run build      # Production build
bun start          # Run production server
bun run typecheck  # Run react-router typegen + tsc
```

## Architecture

**Key directories:**
- `/app/routes.ts` - Route configuration (file-system based routing)
- `/app/root.tsx` - Root layout with error boundary
- `/app/routes/` - Route components
- `/docs/decisions/` - Architecture Decision Records (ADR format)

**Path alias:** `~/` maps to `./app/` (e.g., `import { thing } from '~/utils'`)

## Code Patterns

**Server Components First:** Default to server components. Only use client components (`"use client"`) when necessary (interactivity, browser APIs).

**TypeScript Strict:** No `any` types. `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` enforced.

**Components:** shadcn/ui + Radix UI primitives + Tailwind CSS. Components are copy/paste (not npm packages).

## Development Workflow

1. Check Epic Stack reference (`../epic-stack-reference`) to identify features to port
2. **Always use Context7 MCP** to fetch latest library documentation before implementing
3. Re-implement each feature using modern best practices (not copy/paste)
4. **Write a decision document** in `/docs/decisions/` for every architectural decision (e.g., choosing Drizzle, oxfmt, etc.)
5. E2E tests with Playwright are mandatory - features aren't done until tests pass