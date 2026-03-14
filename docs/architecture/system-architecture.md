# Biogrix System Architecture

This document describes the high-level system design, components, and deployment model for the Biogrix platform.

---

## System Overview

Biogrix is a **Biogas Utility Management Platform** that manages biogas plants, distribution networks, customers, meters, usage tracking, billing, payments, complaints, and maintenance. The system is composed of web applications, a REST API, and background workers.

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├───────────────────────────────┬─────────────────────────────────────────────┤
│     Public Website (web)      │        Admin Dashboard (admin)               │
│     Next.js - Public users    │        Next.js - Internal staff              │
└───────────────┬───────────────┴──────────────────┬──────────────────────────┘
                │                                  │
                └──────────────┬───────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│                        REST API Server (backend/api)                         │
│                        Express.js + JavaScript                               │
│                        - JWT Authentication                                  │
│                        - Rate limiting                                       │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                │ SQL
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│                           PostgreSQL                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                ▲
                                │ SQL
                                │
┌───────────────────────────────┴─────────────────────────────────────────────┐
│                        WORKER LAYER                                          │
│                    Background Jobs (backend/worker)                          │
│                    - Billing runs                                            │
│                    - Report generation                                       │
│                    - Scheduled maintenance reminders                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Public Website (`frontend/apps/web`)

- **Purpose**: Customer-facing portal for households and end-users.
- **Capabilities**: View usage, bills, pay, report complaints/issues.
- **Users**: Household customers.
- **Hosting**: Static/SSR hosting (e.g., Vercel, Netlify, or container).

### 2. Admin Dashboard (`frontend/apps/admin`)

- **Purpose**: Internal management for operators and administrators.
- **Capabilities**: Manage plants, networks, customers, meters, billing, payments, complaints, maintenance, reports.
- **Users**: Staff, operators, admins.
- **Hosting**: Separate deployment, typically behind VPN or SSO.

### 3. REST API (`backend/api`)

- **Purpose**: Central backend for all client applications.
- **Protocol**: REST over HTTPS.
- **Auth**: JWT-based authentication.
- **Architecture**: Modular, feature-based modules.
- **Deployment**: Stateless, horizontally scalable containers or serverless functions.

### 4. Background Worker (`backend/worker`)

- **Purpose**: Asynchronous and scheduled processing.
- **Jobs**: Billing cycles, report generation, maintenance reminders, data exports.
- **Deployment**: Separate process(es) or job queues (e.g., Bull, BullMQ) with shared PostgreSQL.

### 5. PostgreSQL Database

- **Purpose**: Single source of truth for domain data.
- **Access**: API and Worker read/write; no direct client access.
- **Shared**: One schema shared by API and Worker.

---

## Deployment Model

### Independent Deployment Units

| Unit | Path | Deployed As |
|------|------|-------------|
| Public Website | `frontend/apps/web` | Static/SSR app |
| Admin Dashboard | `frontend/apps/admin` | Static/SSR app |
| REST API | `backend/api` | API server |
| Worker | `backend/worker` | Background job processor |

### Deployment Rules

1. **Independent deploys**: Each unit is deployable without deploying others.
2. **Shared database**: API and Worker use the same PostgreSQL instance.
3. **Environment parity**: Dev, staging, and production use the same architecture, with environment-specific config.
4. **No shared runtime**: Frontend and backend run in separate runtimes and hosts.

---

## Data Flow

1. **User → API**: Clients (web, admin) call REST endpoints over HTTPS.
2. **API → Database**: API performs reads/writes via a shared database client.
3. **Worker → Database**: Worker performs batch operations and reads/writes directly.
4. **Worker triggers**: Jobs are triggered by schedule (cron) or by API via job queues.

---

## Principles

- **Modular architecture**: Clear boundaries between web, admin, API, and worker.
- **Separation of concerns**: UI in frontend, business logic in backend.
- **Reusable components**: Shared UI and shared backend utilities.
- **JavaScript only**: Entire codebase uses JavaScript (no TypeScript).
- **Consistent API response format**: Uniform structure for success and error responses.
- **Clear service boundaries**: API and Worker have well-defined responsibilities.
- **Independent deployment**: Each deployable unit can be released on its own schedule.
