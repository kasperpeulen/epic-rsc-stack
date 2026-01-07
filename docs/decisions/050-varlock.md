# Varlock for Environment Variables

Date: 2026-01-07

Status: accepted

## Context

Epic Stack currently scatters environment variables across multiple locations:

- `.env.example` for local development
- Dockerfile for production settings
- `playwright.config.ts` for testing
- Manual `fly secrets set` commands for deployment

This fragmented approach makes it difficult to understand which variables apply to each environment.

**Reference:** [Epic Stack Discussion #1069](https://github.com/epicweb-dev/epic-stack/discussions/1069) - Kent C. Dodds approved Varlock as the solution.

## Decision

Use Varlock for environment variable management with the `.env.{environment}` pattern.

**Setup:**

- `.env.schema` - Declarative schema with @env-spec annotations
- `.env.development` / `.env.test` / `.env.staging` / `.env.production` - Environment defaults
- `.env.*.local` - Secrets (gitignored)
- `@varlock/vite-integration` - Vite plugin for loading and validation
- `bunfig.toml` - Disables Bun's auto .env loading (conflicts with Varlock)

## Consequences

**Benefits:**

- 12-Factor App / Rails-style environment management
- Type-safe: auto-generates TypeScript definitions
- Validation: schema enforces types, required fields, formats
- Clear visibility: each environment's config in one file
- Secure: sensitive values marked, `.local` files gitignored
- Integrations: Vite, Docker, GitHub Actions support

**Trade-offs:**

- Newer tool, smaller community than dotenv
- Requires Node.js 22+ (Bun compatible)
- Learning curve for @env-spec annotation syntax

**Migration path:**

If issues arise, can fall back to Zod-based approach (current Epic Stack pattern) since env files remain standard `.env` format.
