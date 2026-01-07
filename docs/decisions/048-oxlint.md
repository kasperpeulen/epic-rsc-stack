# oxlint

Date: 2026-01-07

Status: accepted

## Context

Epic Stack uses ESLint for linting. ESLint is powerful and extensible but has some drawbacks:

- **Slow**: ESLint can take several seconds on large codebases
- **Complex configuration**: Requires multiple plugins and extensive config
- **Heavy dependencies**: Many packages needed for TypeScript, React, imports, etc.

oxlint is a new linter from the Oxc project, written in Rust. It's designed as a faster alternative to ESLint with built-in support for common rules.

**Performance comparison:**

- oxlint: ~33ms on our codebase (6 files, 102 rules, 10 threads)
- ESLint: typically 1-5 seconds for similar workloads

## Decision

Use oxlint instead of ESLint for linting.

**Setup:** `oxlint --init` + add `react` plugin.

## Consequences

**Benefits:**

- 50-100x faster linting than ESLint
- Sensible defaults via `--init`
- Fewer dependencies (single package)
- Built-in TypeScript and React support
- Excellent error messages with code snippets

**Trade-offs:**

- Fewer rules than ESLint ecosystem (520+ vs thousands)
- No custom rule authoring (yet)
- Newer tool, smaller community

**Migration path:**

- If we need ESLint-specific rules later, we can use `eslint-plugin-oxlint` to run both
