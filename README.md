# Biogrix

Biogas Utility Management Platform for managing biogas plants, gas distribution, households, meters, usage, billing, payments, complaints, and maintenance.

## Repository Structure

```
frontend/       # Next.js applications (web, admin)
backend/        # Express API and background worker
infrastructure/ # Docker, scripts, environment configs
docs/           # Architecture and product documentation
```

## Tech Stack

- **Frontend**: Next.js, JavaScript, TailwindCSS
- **Backend**: Node.js, Express, JavaScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (future)

## Quick Start

### Backend API

```bash
cd backend/api
npm install
cp .env.example .env
# Configure SUPABASE_URL and SUPABASE_ANON_KEY
npm start
```

### Frontend (Web)

```bash
cd frontend/apps/web
npm install
npm run dev
```

### Frontend (Admin)

```bash
cd frontend/apps/admin
npm install
npm run dev
```

## Documentation

See `/docs` for architecture, API, and product documentation.
