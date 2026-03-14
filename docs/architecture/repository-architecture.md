# Biogrix Repository Architecture

This document defines the repository structure and layout standards for the Biogrix platform.

## Overview

Biogrix uses a **split monorepo** architecture where frontend and backend code live in separate top-level folders, enabling independent development, versioning, and deployment while sharing a single repository.

---

## Root Structure

```
/biogrix
├── /frontend          # All frontend applications and shared UI
├── /backend           # All backend services and shared code
├── /infrastructure    # IaC, deployment configs, environments
├── /docs              # Project documentation
├── .cursorrules       # Cursor AI rules
├── README.md
├── .gitignore
└── (root config files)
```

### Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `frontend/` | Public website, admin dashboard, shared UI components |
| `backend/` | REST API server, background workers, shared services |
| `infrastructure/` | Cloud configs, containers, CI/CD, environment definitions |
| `docs/` | Architecture, API, product, and engineering documentation |

---

## Frontend Structure

```
/frontend
├── /apps
│   ├── /web           # Public website (Next.js)
│   └── /admin         # Admin dashboard (Next.js)
│
├── /shared
│   ├── /ui            # Reusable UI components
│   └── /utils         # Frontend utilities
│
├── package.json       # Workspace root
└── (workspace config)
```

### Frontend Conventions

- **Apps** (`/apps`): Deployable Next.js applications. Each app is independently deployable.
- **Shared UI** (`/shared/ui`): Design system components, layouts, and primitives. Must not depend on app-specific code.
- **Shared Utils** (`/shared/utils`): Formatters, validation, API clients, and pure frontend utilities.

### Technology Stack

- **Framework**: Next.js
- **Language**: JavaScript only (no TypeScript)
- **Styling**: TailwindCSS
- **Components**: Functional React components

---

## Backend Structure

```
/backend
├── /api               # Main REST API server
│   └── /modules       # Feature-based modules
│
├── /worker            # Background jobs (billing, reports, scheduled tasks)
│
├── /shared
│   ├── /database      # Database client, schema, migrations
│   └── /utils         # Backend utilities
│
└── package.json
```

### Backend Conventions

- **API** (`/api`): HTTP server. Entry point for all REST endpoints. Stateless, horizontally scalable.
- **Modules** (`/api/modules`): Feature-based modules. Each module owns its routes, handlers, and business logic.
- **Worker** (`/worker`): Background processors for billing, reports, scheduled tasks. May share code with API via `/shared`.
- **Shared Database** (`/shared/database`): Single source of truth for schema, migrations, and client. Used by both `api` and `worker`.
- **Shared Utils** (`/shared/utils`): Date helpers, validators, and non-domain-specific logic.

### Modular Architecture

Backend uses **feature-based modules**. See [Modules](/docs/product/modules.md) for full definition.

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript only (no TypeScript)
- **Database**: PostgreSQL

---

## Infrastructure Structure

```
/infrastructure
├── /docker            # Container definitions
├── /terraform         # Cloud provisioning (optional)
├── /scripts           # Deployment and setup scripts
└── README.md
```

Infrastructure code supports independent deployment of `frontend/apps/web`, `frontend/apps/admin`, `backend/api`, and `backend/worker`.

---

## Docs Structure

```
/docs
├── /architecture      # System and repository architecture
├── /api               # API design and standards
├── /database          # Database design and conventions
├── /engineering       # Development rules and workflows
└── /product           # Product overview and modules
```

---

## Cross-Cutting Rules

1. **JavaScript only**  
   The entire codebase uses JavaScript. No TypeScript anywhere.

2. **No cross-boundary imports**  
   - Frontend must not import from `backend/`.
   - Backend must not import from `frontend/`.
   - Shared code lives under `/frontend/shared` or `/backend/shared` respectively.

3. **Independent deployment**  
   Each deployable unit (web, admin, api, worker) must be buildable and runnable on its own.

4. **Single database schema**  
   Schema and migrations are defined in `backend/shared/database`. API and worker consume the same database.

5. **Documentation as code**  
   Architecture and engineering decisions live in `/docs`. Changes to structure or conventions require documentation updates.
