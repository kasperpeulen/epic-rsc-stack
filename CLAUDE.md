# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@README.md

## Development Workflow

1. Check Epic Stack reference (`../epic-stack-reference`) to identify features to port
2. **Always use Context7 MCP** to fetch latest library documentation before implementing
3. Re-implement each feature using modern best practices (not copy/paste)
4. **Write a decision document** in `/docs/decisions/` for every architectural decision
5. E2E tests with Playwright are mandatory - features aren't done until tests pass

## Automated Code Quality (PostToolUse Hooks)

Claude Code is configured with PostToolUse hooks in `.claude/settings.json` that automatically run on every file edit/write:

- **Linting**: `oxlint --fix` runs on `*.{js,ts,jsx,tsx}` files
- **Formatting**: `oxfmt` runs on `*.{js,ts,jsx,tsx,json,css,md}` files

These hooks mirror the lefthook pre-commit configuration, ensuring consistent code quality whether changes are made by Claude Code or committed via git. The hooks run only on the specific file that was changed, not the entire codebase
