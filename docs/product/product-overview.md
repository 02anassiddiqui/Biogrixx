# Biogrix Product Overview

Biogrix is a **Biogas Utility Management Platform** for managing biogas plants, distribution networks, households, meters, usage tracking, billing, payments, and maintenance.

---

## Domain Entities

### Core Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Biogas Plant** | Production facility for biogas | Location, capacity, status |
| **Distribution Network** | Gas pipeline infrastructure | Plant association, coverage area |
| **Household / Customer** | End consumer of gas | Address, network connection, contact |
| **Gas Meter** | Device measuring consumption | Meter ID, household, readings |
| **Gas Usage** | Recorded consumption over time | Meter, period, volume |

### Operational Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Bill** | Invoice for gas consumption | Customer, period, amount, status |
| **Payment** | Record of payment | Bill, amount, method, date |
| **Complaint** | Customer complaint or feedback | Customer, description, status |
| **Maintenance Issue** | Repair or service request | Location, type, status, priority |

---

## Functional Areas

### 1. Biogas Plant Management

- Register and maintain plant details.
- Track capacity and operational status.
- Associate plants with distribution networks.

### 2. Distribution Network Management

- Define and manage pipeline networks.
- Link networks to plants and households.
- Maintain coverage and topology metadata.

### 3. Customer / Household Management

- Manage customer records and addresses.
- Link households to networks and meters.
- Support contact and communication preferences.

### 4. Meter & Usage Tracking

- Manage meter installation and assignment.
- Record meter readings (manual or automated).
- Calculate consumption per period.
- Support usage analytics and reporting.

### 5. Billing

- Generate bills based on usage and tariffs.
- Support different billing cycles.
- Handle prorations, adjustments, and credits.
- Track bill status (draft, issued, paid, overdue).

### 6. Payments

- Record payments (cash, bank transfer, mobile, etc.).
- Match payments to bills.
- Support partial payments and overpayments.
- Generate payment receipts.

### 7. Maintenance & Issues

- Record maintenance requests.
- Categorize and prioritize issues.
- Track status and resolution.
- Support scheduling and assignment.

---

## User Roles

| Role | Primary System | Capabilities |
|------|----------------|--------------|
| **Public User / Household** | Public Website | View usage, bills; make payments; report issues |
| **Operator** | Admin Dashboard | Manage plants, networks, customers, meters; view reports |
| **Billing Clerk** | Admin Dashboard | Issue bills, record payments, handle adjustments |
| **Maintenance Staff** | Admin Dashboard | Manage maintenance issues, update status |
| **Administrator** | Admin Dashboard | Full access; user management; configuration |

---

## Application Mapping

| Application | Target Users | Main Features |
|-------------|--------------|---------------|
| **Public Website** (`frontend/apps/web`) | Households | Usage viewing, bill payment, issue reporting |
| **Admin Dashboard** (`frontend/apps/admin`) | Staff | All operational and management functions |

---

## Workflow Examples

### Billing Cycle

1. Usage is recorded or imported for a billing period.
2. Worker or API calculates consumption and tariff.
3. Bills are generated and issued.
4. Customers pay via public website or in-person.
5. Payments are recorded and linked to bills.

### Maintenance Issue

1. Customer or staff creates an issue (public site or admin).
2. Issue is categorized and prioritized.
3. Maintenance staff is assigned and status is updated.
4. Issue is resolved and closed.
5. Optional follow-up or customer notification.
