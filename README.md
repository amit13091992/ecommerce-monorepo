# Ecommerce Monorepo

A production-ready TypeScript full-stack e-commerce monorepo scaffold.

This repository provides a complete starting point for building a real e-commerce application. It includes a frontend (Vite + React + TypeScript), a backend API (Express + TypeScript + Prisma + PostgreSQL), and a shared package for types/constants. The scaffold is opinionated but intentionally minimal so you can extend it into a full product.

---

## Features included in this repository

- Monorepo managed with npm workspaces (apps/* and packages/*).
- Frontend (apps/web)
  - Vite + React + TypeScript
  - React Router v6 routes
  - TanStack Query for server-state
  - Axios centralized client (`src/services/api.ts`)
  - React Hook Form + Zod for form validation
  - Zustand basic store integration for client-side state (cart scaffolded)
  - Pages scaffolded: Home, Products, Product Details, Categories, Cart, Auth (Login/Register/Forgot/Reset)
  - Basic UI components, routing, and loading/error placeholders (lightweight, ready to extend)

- Backend (apps/api)
  - Node.js + Express + TypeScript
  - Prisma ORM (PostgreSQL) with schema and seed script
  - Authentication: JWT-based access token with secure password hashing (bcrypt)
  - Auth endpoints: register, login, logout, me, forgot-password, reset-password
  - Password-reset flow: secure single-use token stored hashed with expiration (dev: reset link logged)
  - Structured folders: controllers, services, repositories, middleware, routes, utils
  - Request validation with Zod and centralized error handler
  - Security middlewares: Helmet, CORS (configured), Morgan logger
  - Prisma models: User, Category, Product, Cart, CartItem, PasswordResetToken
  - Prisma seed generating sample categories, products, and an admin user

- Shared package (packages/shared)
  - Shared TypeScript types and simple interfaces (UserDTO, PaginationMeta, etc.)
  - Used by frontend & backend to keep contracts aligned

- Dev / DX
  - TypeScript configured with strict mode and noUncheckedIndexedAccess
  - ESLint + Prettier configuration files
  - Docker Compose to run PostgreSQL locally
  - Scripts at repo root to run dev servers concurrently, build, lint, format, typecheck, and manage Prisma
  - Basic Vitest/testing foundation is scaffolded (add tests as you extend)

- API features
  - Product endpoints support pagination, search, category filtering, and sorting (scaffolded)
  - Category and Cart endpoints scaffolded
  - Consistent API response format: { success, data, meta?, error? }

- Security-minded defaults
  - No secrets committed; .env.example provided
  - Bcrypt password hashing
  - Password-reset tokens stored hashed
  - Generic forgot-password responses (do not reveal existence)
  - Token expiration handling

---

## Architecture (high-level)

Simple diagram (GitHub-friendly Mermaid):

```mermaid
graph LR
  W[Web (Vite + React)]
  A[API (Express + TypeScript)]
  DB[(Postgres + Prisma)]
  W --> A
  A --> DB
```


## Repository structure

```
ecommerce-monorepo/
├── apps/
│   ├── web/           # Vite + React frontend
│   └── api/           # Express backend with Prisma
├── packages/
│   └── shared/        # Shared types/constants
├── .env.example
├── docker-compose.yml
├── package.json       # root workspaces and scripts
├── tsconfig.json      # root TS config (paths -> shared)
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

## Quickstart (development)

Prerequisites
- Node 18+ (or compatible)
- npm
- Docker (recommended for Postgres) or a local PostgreSQL instance

1. Install dependencies

   npm install

2. Start PostgreSQL (recommended via Docker Compose)

   docker compose up -d

   The default DB connection (in .env.example) is:

   postgresql://postgres:password@localhost:5432/ecommerce

3. Create a copy of .env.example -> .env and update secrets

   cp .env.example .env
   # Edit .env and set secure JWT_SECRET, DB credentials for production, etc.

4. Generate Prisma client

   npm run db:generate

5. Run migrations (creates schema)

   npm run db:migrate

6. Seed the database

   npm run db:seed

7. Start development servers (root)

   npm run dev

   - Web: http://localhost:5173
   - API: http://localhost:5000/api

---

## Available scripts (root)

- npm run dev            - Start both API & Web concurrently
- npm run dev:api        - Start API only (workspace script)
- npm run dev:web        - Start Web only (workspace script)
- npm run build          - Build all workspaces
- npm run lint           - Run ESLint across the repo
- npm run format         - Run Prettier to format files
- npm run typecheck      - Run TypeScript compiler checks
- npm run db:generate    - prisma generate (runs in api workspace)
- npm run db:migrate     - prisma migrate dev (runs in api workspace)
- npm run db:seed        - Seeds the database (runs in api workspace)

---

## API Overview (endpoints scaffolded)

Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Categories
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

Cart
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:productId
- DELETE /api/cart/items/:productId
- DELETE /api/cart

Notes: mutation endpoints are scaffolded; add authorization/roles as required when moving to production.

---

## Authentication flow

- Register: user creates an account (name, email, password, confirmPassword). Passwords are hashed with bcrypt.
- Login: verifies credentials and returns a JWT access token (short-lived). The scaffold logs token usage and provides a token in the response. You may optionally implement an HTTP-only refresh cookie flow.
- Forgot password: accepts email, generates a secure random token, stores a hashed token with expiration, and (in development) logs the reset URL rather than sending email.
- Reset password: accepts token and new password, validates token (hash + expiration), updates password, invalidates tokens.

Security note: Do not store sensitive data in JWTs. Use refresh tokens if you need long-lived sessions.

---

## Prisma models

The Prisma schema (apps/api/prisma/schema.prisma) includes the following models:
- User
- Category
- Product
- Cart
- CartItem
- PasswordResetToken

Use Prisma migrations and the provided seed script to populate sample categories/products and an admin user.

---

## Testing

This scaffold includes a testing foundation (Vitest) in both apps. You should add tests covering auth flows, products, and cart operations. Example tests for backend (supertest) and frontend (React Testing Library) are recommended but not exhaustive in this initial scaffold.

---

## Limitations & next steps

This scaffold provides a working foundation but is intentionally minimal in several areas:
- Frontend UI is a simple skeleton: extend components, add design system, and polish UX.
- Authorization/roles (admin) are not fully implemented—add role checks for mutations.
- Refresh-token cookie flow is minimal; for production implement rotating refresh tokens in httpOnly secure cookies.
- Add production-grade logging, monitoring, and error tracking (Sentry, etc.).
- Add rate limiting on all sensitive endpoints (auth already planned as a rate-limited path).
- Add CI workflows to run lint/typecheck/tests and a Dockerfile for production builds.

---

## Contributing and development workflow

- Work on feature branches created from `develop`.
- Open PRs into `main` or use a GitFlow-like approach (feature -> develop -> main) as you prefer.
- Keep secrets out of the repo and configure environment variables in your environment/CI provider.

---

If you want, I can now:
- Open a PR from `develop` -> `main` and merge it (squash merge), or
- Create initial CI workflows, add more complete tests, or implement the refresh-token cookie flow.

Tell me which follow-up you want next and I will implement it.
