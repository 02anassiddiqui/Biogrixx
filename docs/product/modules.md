# Biogrix Backend Modules

This document defines the feature-based modules for the Biogrix backend API.

---

## Overview

The backend API uses a **modular architecture**. Each module is self-contained with its own routes, handlers, and business logic. Modules share the database client and utilities from `backend/shared`.

---

## Module Structure

Each module follows this structure:

```
backend/api/modules/<module-name>/
├── routes.js        # Route definitions
├── handlers.js      # Request handlers
├── service.js       # Business logic (optional)
└── index.js         # Module entry, exports router
```

---

## Defined Modules

### 1. customers

- **Purpose**: Customer/household management.
- **Endpoints**: CRUD for customers, list with filters.
- **Key entities**: households, customers.

### 2. plants

- **Purpose**: Biogas plant management.
- **Endpoints**: CRUD for plants, status updates.
- **Key entities**: plants.

### 3. gas-usage

- **Purpose**: Gas consumption and meter readings.
- **Endpoints**: Record readings, retrieve usage by period, consumption analytics.
- **Key entities**: gas_meters, meter_readings, usage records.

### 4. billing

- **Purpose**: Bill generation and management.
- **Endpoints**: Generate bills, list bills, bill details, status updates.
- **Key entities**: bills, tariffs.

### 5. payments

- **Purpose**: Payment recording and tracking.
- **Endpoints**: Record payment, list payments, link to bills.
- **Key entities**: payments, bill allocations.

### 6. complaints

- **Purpose**: Customer complaints and feedback.
- **Endpoints**: Create complaint, list complaints, update status.
- **Key entities**: complaints.

### 7. maintenance

- **Purpose**: Maintenance requests and issue tracking.
- **Endpoints**: Create issue, list issues, assign, update status.
- **Key entities**: maintenance_issues.

### 8. reports

- **Purpose**: Reporting and analytics.
- **Endpoints**: Usage reports, billing reports, maintenance summaries.
- **Key entities**: Aggregates across multiple tables.

---

## Module Registration

Modules are registered in the main API app:

```javascript
// backend/api/app.js (conceptual)
const customersRouter = require('./modules/customers');
const plantsRouter = require('./modules/plants');
// ...

app.use('/v1/customers', customersRouter);
app.use('/v1/plants', plantsRouter);
app.use('/v1/gas-usage', gasUsageRouter);
app.use('/v1/billing', billingRouter);
app.use('/v1/payments', paymentsRouter);
app.use('/v1/complaints', complaintsRouter);
app.use('/v1/maintenance', maintenanceRouter);
app.use('/v1/reports', reportsRouter);
```

---

## Module Rules

1. **Isolation**: Modules must not import from other modules directly. Use shared services or events if cross-module logic is needed.
2. **Database access**: All modules use `backend/shared/database` for queries.
3. **Response format**: All endpoints return the standard API response structure (success, data, message).
4. **Naming**: Module folder names use kebab-case.
