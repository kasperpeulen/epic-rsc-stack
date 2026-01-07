# Epic RSC Stack

Port of [Epic Stack](https://github.com/epicweb-dev/epic-stack) to modern patterns using React Server Components.

⚠️ **EXPERIMENTAL**: This uses React Router v7 with RSC, which is experimental technology.

## Project Goal

Port all Epic Stack features (routes, auth flows, CRUD, RBAC) using latest best practices. Fresh designs welcome - no pixel-perfect replication needed.

Reference implementation: `../epic-stack-reference`

## Stack

| Category   | Technology                                       |
| ---------- | ------------------------------------------------ |
| Runtime    | Bun                                              |
| Framework  | React Router v7 + React 19 RSC                   |
| Build      | Vite 7                                           |
| Styling    | Tailwind CSS v4 + shadcn/ui                      |
| Database   | SQLite + Drizzle ORM + LiteFS                    |
| Auth       | @simplewebauthn, @node-rs/argon2, @epic-web/totp |
| Validation | Zod + Conform                                    |
| Testing    | Playwright (E2E), Vitest (unit)                  |
| Linting    | oxlint                                           |
| Formatting | oxfmt                                            |
| Deployment | Fly.io with branch deployments                   |
| Monitoring | Sentry                                           |
| Email      | Resend                                           |

## Getting Started

```bash
bun install
cp .env.local.example .env.local
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Commands

```bash
bun run dev        # Start dev server
bun run build      # Production build
bun start          # Run production server
bun run typecheck  # Type checking
```

## Architecture

**Key directories:**

- `/app/routes.ts` - Route configuration (file-system based routing)
- `/app/root.tsx` - Root layout with error boundary
- `/app/routes/` - Route components
- `/docs/decisions/` - Architecture Decision Records

**Path alias:** `~/` maps to `./app/`

## Code Patterns

- **Server Components First** - Only use client components (`"use client"`) when necessary
- **TypeScript Strict** - No `any` types, strict mode enabled
- **Components** - shadcn/ui + Radix UI primitives + Tailwind CSS
- **Use Defaults** - Prefer tool defaults over custom configuration (e.g., `oxlint --init`)

## Contributing

Each PR should:

1. Check off completed items in [MILESTONES.md](./MILESTONES.md)
2. Write an ADR in `/docs/decisions/` for significant architectural decisions
3. Include tests (E2E with Playwright, unit with Vitest)

## Documentation

- [MILESTONES.md](./MILESTONES.md) - Project progress tracking
- [docs/decisions/](./docs/decisions/) - Architecture Decision Records
- [React Router docs](https://reactrouter.com/)
- [React Server Components guide](https://reactrouter.com/how-to/react-server-components)
