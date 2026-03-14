# Biogrix Database Design

This document defines database design standards for the Biogrix platform. The database engine is **PostgreSQL**.

---

## Overview

- **Engine**: PostgreSQL
- **Schema location**: `backend/shared/database`
- **Consumers**: `backend/api` and `backend/worker`
- **Migrations**: Versioned, forward-only migrations

## Core Standards (Required)

| Rule | Description |
|------|--------------|
| **snake_case** | All table and column names use snake_case |
| **Plural table names** | Tables are named in plural (e.g., `customers`, `bills`) |
| **id primary keys** | Every table has an `id` column as primary key |
| **created_at** | Timestamp for record creation (UTC) |
| **updated_at** | Timestamp for last update (UTC) |

---

## Table Naming Conventions

| Rule | Example | Avoid |
|------|---------|-------|
| **Plural nouns** | `customers`, `gas_meters` | `customer`, `meter` |
| **snake_case** | `maintenance_issues` | `maintenanceIssues` |
| **Lowercase** | `billing_cycles` | `BillingCycles` |
| **Descriptive** | `household_meter_assignments` | `hma` |

### Junction / Associative Tables

Use the format `table_a_table_b` or `table_a_table_b_relation`:

```
customers_meters          # many-to-many between customers and meters
bill_payment_allocations  # links payments to bills
```

### Naming Examples

```
plants
distribution_networks
households
gas_meters
meter_readings
bills
payments
maintenance_issues
users
roles
```

---

## Column Naming Conventions

| Rule | Example | Avoid |
|------|---------|-------|
| **snake_case** | `created_at`, `full_name` | `createdAt`, `fullName` |
| **Lowercase** | `status` | `Status` |
| **Descriptive** | `previous_reading_value` | `prev_val` |
| **Boolean prefix** | `is_active`, `has_paid` | `active`, `paid` |
| **ID suffix for FKs** | `customer_id`, `plant_id` | `customer`, `plant` |

### Standard Columns

Include these on all tables where applicable:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID or BIGSERIAL | Primary key |
| `created_at` | TIMESTAMPTZ | Creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | Last update timestamp (UTC) |
| `deleted_at` | TIMESTAMPTZ (nullable) | Soft delete timestamp |

---

## Primary Keys

- **Preferred**: `UUID` (e.g., `gen_random_uuid()`)
- **Alternative**: `BIGSERIAL` for high-volume, append-only tables
- **Constraint name**: `pk_<table_name>` (e.g., `pk_customers`)

Example:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

---

## Foreign Keys

| Rule | Description |
|------|-------------|
| **Column name** | `{referenced_table_singular}_id` (e.g., `customer_id`, `plant_id`) |
| **Constraint name** | `fk_{table}_{referenced_table}` |
| **Index** | Index all foreign key columns used in joins |
| **ON DELETE** | Use `CASCADE`, `RESTRICT`, or `SET NULL` explicitly |
| **ON UPDATE** | Typically `CASCADE` |

Example:

```sql
customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT
```

---

## Indexes

### Naming

- Primary key: `pk_<table>`
- Unique: `uq_<table>_<column(s)>`
- Index: `ix_<table>_<column(s)>` or `ix_<table>_<purpose>`

### When to Index

1. Foreign key columns used in joins
2. Columns used in `WHERE`, `ORDER BY`, `GROUP BY`
3. Columns used for uniqueness checks
4. Date/time columns for range queries
5. Status or type columns for filtering

### Partial Indexes

Use for filtered queries:

```sql
CREATE INDEX ix_bills_status_unpaid ON bills(status) WHERE status = 'unpaid';
```

---

## Data Types

| Use Case | PostgreSQL Type | Notes |
|----------|-----------------|-------|
| Primary key | UUID | Prefer over SERIAL |
| Integer IDs | BIGINT, INTEGER | Use BIGINT for high volume |
| Money | NUMERIC(12, 2) | Never use FLOAT for money |
| Text (short) | VARCHAR(n) | Define max length |
| Text (unbounded) | TEXT | For long content |
| Boolean | BOOLEAN | |
| Dates | DATE | Date only |
| Timestamps | TIMESTAMPTZ | Always store in UTC |
| JSON | JSONB | For semi-structured data |
| Enums | ENUM or VARCHAR | Use ENUM for fixed sets |

---

## Soft Deletes

- Add `deleted_at TIMESTAMPTZ` (nullable).
- Default queries filter `WHERE deleted_at IS NULL`.
- Unique constraints must use partial indexes excluding soft-deleted rows:

```sql
CREATE UNIQUE INDEX uq_customers_email ON customers(email) WHERE deleted_at IS NULL;
```

---

## Audit Fields

For sensitive or high-value tables, consider:

- `created_by` (user ID)
- `updated_by` (user ID)

Store in `backend/shared/database` schema and apply consistently where needed.

---

## Migration Practices

### File Naming

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Examples:

```
20250314120000_create_customers_table.sql
20250314120100_add_deleted_at_to_customers.sql
```

### Migration Rules

1. **Forward-only**: No down migrations in production; use new migrations to revert changes.
2. **Idempotent where possible**: Use `IF NOT EXISTS`, `IF EXISTS` for DDL.
3. **Small steps**: One logical change per migration.
4. **No data loss**: Avoid dropping columns without deprecation period; prefer adding new columns.
5. **Lock consideration**: Use `CONCURRENTLY` for index creation when needed to reduce locking.
6. **Test locally first**: Run migrations in dev before staging/production.

### Migration Structure

```
backend/shared/database/
├── migrations/
│   ├── 20250314120000_initial_schema.sql
│   └── 20250314120100_add_indexes.sql
├── schema.js          # Programmatic schema (if using ORM)
└── client.js          # Database client
```

---

## Schema Organization

### Schemas (PostgreSQL Schemas)

- Default: `public`
- Optional: Use schemas such as `core`, `billing`, `maintenance` for logical separation.
- Document schema usage if multiple schemas are introduced.

### Table Grouping

Group related tables conceptually:

- **Core**: plants, distribution_networks, households, users
- **Metering**: gas_meters, meter_readings
- **Billing**: bills, payments, tariffs
- **Maintenance**: maintenance_issues

---

## Security

- Use least-privilege database users; separate roles for API and worker if needed.
- Never store plaintext secrets; use encryption for sensitive columns.
- Apply row-level security (RLS) where multi-tenant isolation is required.
- Parameterize all queries to prevent SQL injection.
