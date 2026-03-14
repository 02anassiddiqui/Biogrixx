# Biogrix Development Rules

This document defines engineering standards, conventions, and workflows for the Biogrix repository.

---

## Coding Principles

| Principle | Description |
|-----------|-------------|
| **Modular architecture** | Clear boundaries between components; avoid cross-folder dependencies. |
| **Separation of concerns** | UI, business logic, and data access are separated. |
| **Reusable components** | Shared UI and utilities; avoid duplication. |
| **JavaScript only** | The entire codebase uses JavaScript. No TypeScript. |
| **Consistent API response format** | Success and error responses follow `{ success, data, message }`. |
| **Clear service boundaries** | API and Worker have well-defined responsibilities. |
| **Independent deployment** | Each app/service is deployable on its own. |

---

## 1. Folder Structure Rules

### Frontend

```
frontend/
├── apps/web/        # Public website only
├── apps/admin/      # Admin dashboard only
└── shared/
    ├── ui/          # Shared components; no app-specific imports
    └── utils/       # Shared utilities; no app-specific imports
```

- **Rules**:
  - Apps must not import from each other.
  - Shared code must not import from apps.
  - Keep shared UI in `shared/ui`, not inside apps.

### Backend

```
backend/
├── api/             # HTTP server with feature-based modules
│   └── modules/     # customers, plants, gas-usage, billing, payments, complaints, maintenance, reports
├── worker/          # Background jobs only
└── shared/
    ├── database/    # Schema, migrations, client
    └── utils/       # Shared utilities
```

- **Rules**:
  - API and Worker must not import from each other directly.
  - Shared code must not depend on API or Worker specifics.
  - Database access goes through `shared/database`.
  - Backend uses modular, feature-based structure. See [Modules](/docs/product/modules.md).

---

## 2. Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `CustomerCard.jsx` |
| Utilities/hooks | camelCase | `useAuth.js`, `formatDate.js` |
| Constants | SCREAMING_SNAKE or camelCase | `API_BASE_URL` or `apiBaseUrl` |
| Folders | kebab-case | `customer-management` |
| Test files | `*.test.js` or `*.spec.js` | `CustomerCard.test.jsx` |

### Code

| Type | Convention |
|------|------------|
| Variables, functions | camelCase |
| Classes, components, types | PascalCase |
| Constants | SCREAMING_SNAKE_CASE or camelCase |
| Database tables/columns | snake_case |
| API paths | kebab-case |

---

## 3. JavaScript Usage Rules

- **JavaScript only**: No TypeScript anywhere in the codebase.
- **Modern syntax**: Use ES6+ (const, let, arrow functions, async/await).
- **JSDoc**: Use JSDoc for documenting function parameters and return values when helpful.
- **No `.ts` or `.tsx` files**: All source files use `.js`, `.jsx`, or `.mjs`.

---

## 4. API Design Standards

Follow [API Standards](/docs/api/api-standards.md):

- REST with plural nouns and kebab-case paths.
- Consistent success/error response envelopes.
- JWT authentication.
- Pagination via `page`, `limit`, `sort`, `order`.

---

## 5. Database Naming Conventions

Follow [Database Design](/docs/database/database-design.md):

- Tables: plural, snake_case.
- Columns: snake_case.
- Primary keys: UUID preferred.
- Standard columns: `id`, `created_at`, `updated_at`, `deleted_at`.

---

## 6. Environment Variable Management

### Naming

- Prefix: `BIOGRIX_` or app-specific (e.g., `API_`, `WORKER_`).
- Format: SCREAMING_SNAKE_CASE.
- Examples: `BIOGRIX_DATABASE_URL`, `API_JWT_SECRET`.

### Files

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.example` | Template with placeholder keys | Yes |
| `.env.local` | Local overrides | No (gitignored) |
| `.env` | Fallback | No (gitignored) |

### Rules

- Never commit secrets (keys, passwords, tokens).
- Document all env vars in `.env.example` and in README.
- Validate required vars at startup.

---

## 7. Logging Standards

### Format

- **Structured JSON** in production for easier parsing.
- **Human-readable** in development.

### Log Levels

| Level | Use Case |
|-------|----------|
| `error` | Unhandled errors, failures |
| `warn` | Recoverable issues, deprecations |
| `info` | Key events (request start, job complete) |
| `debug` | Detailed diagnostics (dev only) |

### What to Log

- Request ID for tracing.
- User ID (when authenticated).
- Duration for slow operations.
- Error stack traces at `error` level.
- Avoid logging sensitive data (passwords, tokens, PII).

### Example

```json
{
  "level": "info",
  "message": "Request completed",
  "requestId": "abc-123",
  "method": "GET",
  "path": "/customers",
  "statusCode": 200,
  "durationMs": 45
}
```

---

## 8. Error Handling Conventions

### Backend

- Use custom error classes (e.g., `ValidationError`, `NotFoundError`).
- Map to HTTP status and error codes per API standards.
- Never expose internal stack traces in production responses.
- Log full error details server-side.

### Frontend

- Handle API errors via a shared error handler or hook.
- Show user-friendly messages; avoid raw error objects in UI.
- Use error boundaries for React component failures.

### Propagation

- Fail fast for invalid input.
- Use `try/catch` at boundaries (API handlers, job runners).
- Re-throw or wrap as appropriate; don’t swallow errors.

---

## 9. Commit Message Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change, no feature/fix |
| `test` | Adding/updating tests |
| `chore` | Build, tooling, deps |

### Examples

```
feat(api): add customer list endpoint with pagination
fix(admin): correct billing period display
docs: update API standards for error format
refactor(worker): extract billing logic to service
chore(deps): upgrade express to 4.21
```

### Rules

- Use present tense: "add" not "added".
- First line ≤ 72 characters.
- Reference issues: `Closes #123` in footer.

---

## 10. Pull Request Workflow

### Branch Naming

- `feature/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `refactor/<short-description>` — refactors
- `docs/<short-description>` — documentation

### PR Requirements

1. **Description**: Explain what, why, and how.
2. **Scope**: One logical change per PR; keep small where possible.
3. **Tests**: New code must have tests; existing tests must pass.
4. **Linting**: No lint errors; enforce via CI.
5. **Review**: At least one approval before merge.
6. **Squash or merge**: Follow team policy; keep history clean.

### PR Template (Suggested)

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated if needed
- [ ] No breaking changes (or documented)
```

---

## 11. Security Guidelines

### General

- Never commit secrets, API keys, or passwords.
- Use environment variables for configuration.
- Keep dependencies up to date; run `npm audit` in CI.

### API

- Validate and sanitize all inputs.
- Use parameterized queries to prevent SQL injection.
- Apply rate limiting.
- Enforce authentication and authorization on protected routes.
- Use HTTPS in production.

### Data

- Encrypt sensitive data at rest where required.
- Minimize logging of PII.
- Follow principle of least privilege for DB users.

### Frontend

- Store tokens securely (httpOnly cookies preferred over localStorage).
- Avoid storing sensitive data in client state.
- Sanitize user-generated content to prevent XSS.

---

## Documentation Index

| Document | Path | Purpose |
|----------|------|---------|
| Repository Architecture | `docs/architecture/repository-architecture.md` | Repo structure |
| System Architecture | `docs/architecture/system-architecture.md` | High-level design |
| Product Overview | `docs/product/product-overview.md` | Domain and features |
| Modules | `docs/product/modules.md` | Backend module definitions |
| API Standards | `docs/api/api-standards.md` | REST API rules |
| Database Design | `docs/database/database-design.md` | DB conventions |
| Development Rules | `docs/engineering/development-rules.md` | This document |
