# Ecommerce Monorepo

A full-stack TypeScript e-commerce monorepo scaffold with frontend (Vite + React), backend (Express + TypeScript + Prisma), and shared types.

See apps/ and packages/ for structure.

## Quick start

1. Install dependencies

   npm install

2. Start local Postgres (recommended via Docker)

   docker compose up -d

3. Generate Prisma client, migrate and seed

   npm run db:generate
   npm run db:migrate
   npm run db:seed

4. Start development (runs both api and web)

   npm run dev

## Structure

- apps/api - Express API with Prisma
- apps/web - Vite React frontend
- packages/shared - Shared types/constants

## Notes

This is an initial scaffold. See apps/api/README.md and apps/web/README.md for app-specific instructions.
