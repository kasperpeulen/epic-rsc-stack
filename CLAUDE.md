# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@README.md

## Development Workflow

1. Check Epic Stack reference (`../epic-stack-reference`) to identify features to port
2. **Always use Context7 MCP** to fetch latest library documentation before implementing
3. Re-implement each feature using modern best practices (not copy/paste)
4. **Write a decision document** in `/docs/decisions/` for every architectural decision
5. E2E tests with Playwright are mandatory - features aren't done until tests pass
