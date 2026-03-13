# Events Demo

Internal tool for managing events across different countries. Track event details, analyze metrics, create new events, and estimate costs based on historical data.

## Features

- Dashboard with key business metrics
- Event management (CRUD)
- Email/password authentication
- Role-based access (admin)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** PostgreSQL with Prisma 7
- **Authentication:** Auth.js 5 (credentials provider)
- **Testing:** Vitest + React Testing Library + Playwright
- **Deployment:** Vercel

## Architecture Overview

The project follows a server-first architecture using the Next.js App Router.

```
app/              # Routes, layouts, API handlers
features/         # Feature modules (components, queries, actions, schemas)
components/       # Shared UI components (layout, ui primitives)
lib/              # Shared infrastructure (db, auth, utils, validation)
prisma/           # Database schema and migrations
tests/            # Unit, integration, and e2e tests
public/           # Static assets
```

Code is organized by feature. Server Components are the default; Client Components are used only for interactivity.

## Setup

### Prerequisites

- Node.js 24 LTS
- pnpm
- PostgreSQL

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env.local
```

| Variable       | Description                              |
|----------------|------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string             |
| `AUTH_SECRET`   | Auth.js secret (generate with `openssl rand -base64 32`) |

### Database Setup

```bash
pnpm db:push       # Push schema to database
pnpm db:seed       # Seed initial admin user
```

### Development

```bash
pnpm dev
```

### Testing

```bash
pnpm test          # Unit/integration tests
pnpm test:e2e      # End-to-end tests (Playwright)
```

## Deployment

Deployed via Vercel. Push to `main` triggers production deployment. Environment variables are configured in the Vercel dashboard.

Database migrations run via `prisma migrate deploy` during the build process.
