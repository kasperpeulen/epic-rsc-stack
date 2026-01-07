# Epic RSC Stack - Milestones

Port of [Epic Stack](https://github.com/epicweb-dev/epic-stack) to modern patterns. Track progress by checking off completed items.

---

## Phase 1: Local Development Tooling

Set up local tools first - CI/CD will use these.

### Linting & Formatting
- [ ] oxlint configuration
- [ ] oxfmt configuration
- [ ] npm scripts (`bun run lint`, `bun run format`)
- [ ] Pre-commit hooks (optional)
- [ ] **ADR:** 048-oxlint.md
- [ ] **ADR:** 049-oxfmt.md

### Environment Variables (Varlock)
- [ ] Varlock setup for env management
- [ ] `.env.development` - development defaults
- [ ] `.env.test` - test environment
- [ ] `.env.production` - production defaults
- [ ] `.env.staging` - staging defaults
- [ ] `.env.*.local` variants (gitignored) for secrets
- [ ] Vite integration
- [ ] **Reference:** [Epic Stack Discussion #1069](https://github.com/epicweb-dev/epic-stack/discussions/1069)
- [ ] **ADR:** 050-varlock.md

### Testing Setup
- [ ] Vitest configuration
- [ ] Playwright configuration
- [ ] Test scripts (`bun run test`, `bun run test:e2e`)
- [ ] Coverage reporting setup

---

## Phase 2: CI/CD & Deployment

Now that local tooling exists, set up CI/CD to use it.

### GitHub Actions
- [ ] Linting workflow (oxlint)
- [ ] Type checking workflow (tsc)
- [ ] Unit tests workflow (Vitest)
- [ ] E2E tests workflow (Playwright)
- [ ] Build workflow
- [ ] Deploy to staging (dev branch)
- [ ] Deploy to production (main branch)
- [ ] Concurrency control (cancel in-progress)
- [ ] Varlock integration for env vars
- [ ] **ADR:** 051-github-actions.md

### Docker
- [ ] Multi-stage Dockerfile
- [ ] Bun runtime base image
- [ ] Varlock integration
- [ ] Production optimizations
- [ ] Health check configuration

### Fly.io Deployment
- [ ] `fly.toml` configuration
- [ ] Primary region setup
- [ ] Memory swap (512MB)
- [ ] Internal/external ports
- [ ] Concurrency limits
- [ ] TCP health check
- [ ] HTTP health check (`/resources/healthcheck`)
- [ ] **ADR:** 052-fly-deployment.md

### Branch Deployments
- [ ] Preview environments for PRs
- [ ] Automatic cleanup on merge
- [ ] Environment-specific secrets

---

## Phase 3: Core Technologies

Infrastructure and utilities that features depend on.

### Database (SQLite + Drizzle)
- [ ] Drizzle ORM setup
- [ ] SQLite configuration
- [ ] Schema definition (User, Note, Session, etc.)
- [ ] Migrations system
- [ ] Seed script
- [ ] WAL mode for production
- [ ] LiteFS configuration for multi-region
- [ ] Cache database (separate SQLite)
- [ ] **ADR:** 053-drizzle-orm.md

### Sessions & Cookies
- [ ] Database-backed sessions
- [ ] Session table in Drizzle schema
- [ ] Cookie configuration (HTTP-only, SameSite)
- [ ] Session expiration handling
- [ ] Sign out all sessions feature

### Email Service (Resend)
- [ ] Resend API integration
- [ ] Email sending utility
- [ ] React Email templates
- [ ] Development mock mode (console logging)
- [ ] Signup verification email
- [ ] Password reset email
- [ ] Email change notification

### SVG Icons
- [ ] Icon sprite generation (vite-plugin-icons-spritesheet)
- [ ] Icon component
- [ ] Source icons directory (`other/svg-icons/`)
- [ ] Auto-generated sprite and types

### Image Storage (Tigris S3)
- [ ] S3-compatible client setup
- [ ] AWS Signature v4 signing
- [ ] Upload utility (signed PUT)
- [ ] Retrieval utility (signed GET)
- [ ] File organization structure
- [ ] Metadata storage in database
- [ ] **ADR:** 054-tigris-storage.md

### Image Optimization
- [ ] Sharp for server-side processing
- [ ] Optimization endpoint
- [ ] Responsive image sizes
- [ ] Format conversion (WebP/AVIF)

### Monitoring (Sentry)
- [ ] Sentry SDK setup (@sentry/react-router)
- [ ] Error tracking
- [ ] Performance profiling
- [ ] Source map upload
- [ ] Transaction filtering (healthcheck)
- [ ] Release tracking

### Rate Limiting
- [ ] express-rate-limit setup
- [ ] Default limits (1000/min)
- [ ] Strong limits for auth routes (100/min)
- [ ] Strongest limits for verify/admin (10/min)

### Security Headers
- [ ] Helmet.js configuration
- [ ] Content Security Policy (report-only)
- [ ] X-Robots-Tag configuration
- [ ] Compression (gzip)

### Caching
- [ ] @epic-web/cachified setup
- [ ] LRU memory cache (L1)
- [ ] SQLite cache database (L2)
- [ ] Cache timing reports

### Form Validation
- [ ] Zod schemas
- [ ] Conform integration
- [ ] Client + server validation
- [ ] Error message handling

### Utilities
- [ ] CUID generation (@paralleldrive/cuid2)
- [ ] Client hints (@epic-web/client-hints)
- [ ] Invariant helpers (@epic-web/invariant)
- [ ] Graceful shutdown (close-with-grace)
- [ ] QR code generation (for 2FA)
- [ ] Toast notifications (sonner)

---

## Phase 4: Authentication

Complete auth system with multiple methods.

### Password Authentication
- [ ] Argon2 password hashing (@node-rs/argon2)
- [ ] Password table in schema
- [ ] Login form
- [ ] Password validation rules
- [ ] Common password check (PwnedPasswords API)
- [ ] Create password (for OAuth users)
- [ ] Change password

### Signup Flow
- [ ] `/signup` route
- [ ] Email input form
- [ ] OTP code generation
- [ ] Verification email sending
- [ ] `/verify` route for code entry
- [ ] Onboarding form (username, name, password)
- [ ] Honeypot protection
- [ ] Terms of Service agreement

### Login Flow
- [ ] `/login` route
- [ ] Username/password form
- [ ] "Remember me" checkbox
- [ ] Redirect handling
- [ ] Failed login handling

### Password Reset
- [ ] `/forgot-password` route
- [ ] Reset email sending
- [ ] `/reset-password` route
- [ ] Token validation
- [ ] New password form

### OAuth (GitHub)
- [ ] GitHub OAuth app setup
- [ ] `/auth/github` redirect route
- [ ] `/auth/github/callback` handler
- [ ] Connection table in schema
- [ ] `/onboarding/github` for new users
- [ ] Link to existing account option
- [ ] Pre-fill from GitHub profile

### Passkeys (WebAuthn)
- [ ] @simplewebauthn/browser setup
- [ ] @simplewebauthn/server setup
- [ ] Passkey table in schema
- [ ] Register new passkey flow
- [ ] Login with passkey
- [ ] List registered passkeys
- [ ] Delete passkey
- [ ] Device type detection

### Two-Factor Authentication (TOTP)
- [ ] @epic-web/totp setup
- [ ] 2FA enable flow
- [ ] QR code display
- [ ] Verification code input
- [ ] 2FA disable flow
- [ ] 2FA check during login
- [ ] 2FA required for sensitive actions

### Session Management
- [ ] Session creation on login
- [ ] Session table with expiration
- [ ] `/logout` route
- [ ] View active sessions count
- [ ] Sign out all other sessions

---

## Phase 5: Core Features

User-facing features - the actual Notes app.

### User Model
- [ ] User table (id, email, username, name, createdAt, updatedAt)
- [ ] UserImage table for profile photos
- [ ] Role and Permission tables for RBAC

### Public User Profiles
- [ ] `/users` - user directory
- [ ] `/users/:username` - public profile
- [ ] Display name, username, join date
- [ ] Show profile photo
- [ ] Show notes count
- [ ] `/me` redirect to own profile

### Notes CRUD
- [ ] Note table (id, title, content, ownerId, timestamps)
- [ ] `/users/:username/notes` - list notes
- [ ] `/users/:username/notes/new` - create note
- [ ] `/users/:username/notes/:noteId` - view note
- [ ] `/users/:username/notes/:noteId/edit` - edit note
- [ ] Delete note action
- [ ] Owner-only edit/delete permissions

### Note Images
- [ ] NoteImage table
- [ ] Image upload in note editor
- [ ] Image display in notes
- [ ] Alt text support
- [ ] Multiple images per note
- [ ] Image deletion

### User Settings
- [ ] `/settings/profile` - settings overview
- [ ] Edit username
- [ ] Edit name

### Profile Photo
- [ ] `/settings/profile/photo` route
- [ ] Photo upload form
- [ ] Photo preview
- [ ] Change photo
- [ ] Delete photo

### Change Email
- [ ] `/settings/profile/change-email` route
- [ ] New email input
- [ ] 2FA verification (if enabled)
- [ ] Verification code to new email
- [ ] Notification to old email
- [ ] Prevent duplicate emails

### Password Management UI
- [ ] `/settings/profile/password` route
- [ ] Change password form
- [ ] `/settings/profile/password/create` for OAuth users

### Two-Factor UI
- [ ] `/settings/profile/two-factor` route
- [ ] Enable/disable 2FA
- [ ] `/settings/profile/two-factor/verify` - setup verification

### Connections Management
- [ ] `/settings/profile/connections` route
- [ ] List connected providers
- [ ] Delete connection (with password requirement check)

### Passkeys Management
- [ ] `/settings/profile/passkeys` route
- [ ] List registered passkeys
- [ ] Register new passkey button
- [ ] Delete passkey

### Download User Data
- [ ] `/resources/download-user-data` endpoint
- [ ] Collect all user data (profile, notes, connections, sessions)
- [ ] Export as JSON
- [ ] Include image URLs

### Delete Account
- [ ] Delete account button in settings
- [ ] Confirmation dialog
- [ ] Delete all user data
- [ ] Session termination

---

## Phase 6: Admin & Polish

Administrative features and final polish.

### Admin Cache Management
- [ ] `/admin/cache` route
- [ ] Admin role check
- [ ] View cache entries (SQLite + LRU)
- [ ] Search cache by key
- [ ] Delete cache entries
- [ ] Pagination
- [ ] Instance selection (distributed)

### RBAC Permissions
- [ ] Permission model (action, entity, access)
- [ ] Role model with permissions
- [ ] User roles assignment
- [ ] Permission checking utilities
- [ ] Admin role setup
- [ ] requireUserWithRole utility

### Marketing Pages
- [ ] `/` - Landing page
- [ ] `/about` - About page
- [ ] `/privacy` - Privacy policy
- [ ] `/tos` - Terms of service
- [ ] `/support` - Support page

### SEO
- [ ] `/robots.txt` route
- [ ] `/sitemap.xml` route
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Canonical URLs

### Resource Routes
- [ ] `/resources/healthcheck` - health status
- [ ] `/resources/images` - image serving/optimization
- [ ] `/resources/theme-switch` - dark/light mode toggle

### Error Handling
- [ ] Root error boundary
- [ ] 404 Not Found page
- [ ] 500 Error page
- [ ] Graceful error displays
- [ ] Error logging to Sentry

### Toast Notifications
- [ ] Sonner setup
- [ ] Success toasts
- [ ] Error toasts
- [ ] Info toasts
- [ ] Redirect with toast

### Theme Support
- [ ] Dark/light mode toggle
- [ ] System preference detection
- [ ] Cookie-based persistence
- [ ] No flash of unstyled content

### Testing
- [ ] Playwright E2E test setup
- [ ] Vitest unit test setup
- [ ] Test database seeding
- [ ] CI test execution
- [ ] Coverage reporting

---

## Summary

| Phase | Focus | Description |
|-------|-------|-------------|
| 1 | Local Tooling | oxlint, oxfmt, Varlock, Vitest, Playwright |
| 2 | CI/CD | GitHub Actions, Docker, Fly.io, branch deployments |
| 3 | Technologies | Database, email, icons, images, monitoring, security |
| 4 | Authentication | Password, OAuth, passkeys, 2FA, sessions |
| 5 | Features | Profiles, notes, settings, data management |
| 6 | Admin & Polish | Cache admin, RBAC, marketing, SEO, error handling |

**Total estimated items: ~150+**

Each item should be implemented using latest best practices with Context7 MCP for documentation. Write an ADR for significant architectural decisions.
