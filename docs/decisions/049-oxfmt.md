# oxfmt

Date: 2026-01-07

Status: accepted

## Context

Epic Stack uses Prettier for code formatting. oxfmt is the Oxc project's formatter, written in Rust, designed as a faster Prettier alternative.

## Decision

Use oxfmt instead of Prettier for formatting.

**Setup:** `oxfmt --init`

## Consequences

**Benefits:**

- Fast (580ms on 95 files)
- Consistent with oxlint (same Oxc toolchain)
- Minimal config

**Trade-offs:**

- Newer tool, fewer options than Prettier
- Some formatting differences from Prettier
