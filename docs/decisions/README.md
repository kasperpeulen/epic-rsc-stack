# Decisions

This directory contains all the decisions we've made for the Epic RSC Stack project and serves as a record for whenever we wonder why certain decisions were made.

Decisions in here are never final. But these documents should serve as a good way for someone to come up to speed on why certain decisions were made.

## Decision Categories

### Inherited from Epic Stack

Most decisions (001-046) are inherited from [Epic Stack](https://github.com/epicweb-dev/epic-stack) because they apply equally well to this project. These cover topics like:

- TypeScript only (001)
- SQLite database (003)
- GitHub Actions CI/CD (004)
- Sessions management (007)
- Content Security Policy (008)
- TOTP/2FA (014)
- Monitoring (015)
- RBAC Permissions (028)
- Passkeys (039)
- And many more...

### Epic RSC Stack Specific Decisions

Starting from 047, we document decisions specific to Epic RSC Stack that differ from or extend Epic Stack:

- **047** - Bun runtime over Node.js

## Format

Each decision document follows the template in `000-template.md` with:

- **Date**: When the decision was made
- **Status**: proposed | rejected | accepted | deprecated | superseded by [XXX]
- **Context**: The background and reasoning
- **Decision**: What we decided
- **Consequences**: The implications of this decision
