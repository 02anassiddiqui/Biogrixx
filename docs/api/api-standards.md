# Biogrix API Standards

This document defines REST API design standards for the Biogrix backend.

---

## Overview

The Biogrix API is a RESTful JSON API served by `backend/api`. All clients (public website and admin dashboard) consume these endpoints over HTTPS.

---

## REST Conventions

### Base URL

```
Production:  https://api.biogrix.example.com/v1
Staging:     https://api-staging.biogrix.example.com/v1
Development: http://localhost:3001/v1
```

- **Versioning**: All endpoints are prefixed with `/v1`. Future versions use `/v2`, etc.
- **HTTPS**: Production and staging use HTTPS only.

---

## Endpoint Naming

### Resource Naming

| Rule | Example | Avoid |
|------|---------|-------|
| Use **plural nouns** | `/customers`, `/meters`, `/bills` | `/customer`, `/meter` |
| Use **kebab-case** | `/maintenance-issues` | `/maintenanceIssues` |
| Nest only when meaningful | `/customers/:id/meters` | `/customers/:id/bills/payments` |
| Limit nesting depth | Max 2 levels | Deeper nesting |
| Use IDs for resources | `/customers/:id` | `/customers/:name` |

### HTTP Methods

| Method | Use Case | Example |
|--------|----------|---------|
| `GET` | Read (list or single) | `GET /customers`, `GET /customers/:id` |
| `POST` | Create | `POST /customers` |
| `PUT` | Full replace | `PUT /customers/:id` |
| `PATCH` | Partial update | `PATCH /customers/:id` |
| `DELETE` | Remove | `DELETE /customers/:id` |

- Prefer `PATCH` for updates when the client sends only changed fields.
- Use `PUT` when the client sends the full resource representation.

### Action Endpoints

For non-CRUD actions, use **verb-based** paths:

```
POST /bills/:id/issue
POST /bills/:id/void
POST /payments/:id/receipt
POST /maintenance-issues/:id/assign
```

Avoid:
- `GET /bills/:id/issue` (use POST for mutations)
- `POST /issue-bill` with ID in body (prefer resource-centric paths)

---

## Response Structure

### Success Response

All successful responses use a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": ""
}
```

- **success**: Always `true` for successful responses.
- **data**: Response payload. Object for single resource, array for collections.
- **message**: Optional human-readable message (e.g., "Customer created successfully").

### Paginated Response

For list endpoints with pagination:

```json
{
  "success": true,
  "data": [ ... ],
  "message": "",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Pagination parameters (query string)**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-based) |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | (varies) | Sort field |
| `order` | string | `asc` | `asc` or `desc` |

---

## Error Response Format

All errors return:

```json
{
  "success": false,
  "data": null,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

- **success**: Always `false` for error responses.
- **data**: Always `null`.
- **message**: Human-readable error summary.
- **errors**: Optional array of field-level validation errors.
- **code**: Machine-readable error code (optional).

### HTTP Status Codes

| Code | Use Case |
|------|----------|
| 200 | Success (GET, PATCH, PUT) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Bad request, validation error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate) |
| 422 | Unprocessable entity |
| 429 | Rate limited |
| 500 | Internal server error |

### Error Codes

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource does not exist |
| `CONFLICT` | State conflict (e.g., duplicate) |
| `INTERNAL_ERROR` | Unexpected server error |

---

## Authentication

### JWT-Based Auth

- **Header**: `Authorization: Bearer <token>`
- **Token type**: JWT (RS256 or HS256)
- **Expiry**: Configurable (e.g., 15m access, 7d refresh)

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Email/password login, returns tokens |
| `/auth/refresh` | POST | Refresh token, returns new access token |
| `/auth/logout` | POST | Invalidate refresh token (if stored) |

### Token Payload (Claims)

- `sub` (subject): User ID
- `role`: User role
- `exp`: Expiration
- `iat`: Issued at

### Protected vs Public

- Most endpoints require a valid JWT.
- Public endpoints (e.g., `/auth/login`, health check) do not.
- Role-based access is enforced per endpoint.

---

## Request Conventions

### Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/json` (required for POST/PUT/PATCH with body) |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <token>` for protected routes |
| `X-Request-ID` | Optional client-provided request ID for tracing |

### Date/Time Format

- Use ISO 8601: `YYYY-MM-DDTHH:mm:ssZ` (UTC).
- Query params for dates: `YYYY-MM-DD`.

---

## Idempotency

For critical mutations (e.g., payments), support idempotency:

- Client sends `Idempotency-Key: <unique-key>`.
- Server stores key and returns the same response for duplicate requests.

---

## Rate Limiting

- Apply rate limits per IP or per user.
- Return `429 Too Many Requests` with `Retry-After` when exceeded.
- Document limits in API docs.

---

## Documentation

- Maintain OpenAPI/Swagger spec for all endpoints.
- Include request/response examples and error codes.
- Keep spec in sync with implementation (ideally auto-generated or validated in CI).
