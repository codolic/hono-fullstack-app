# Hono Fullstack App

A lightweight TypeScript full-stack starter built as a pnpm monorepo. The app keeps the frontend and backend separated during development, then serves the built React app and Hono API from one Node process in production.

This is not an SSR app. The web package builds a client-rendered Vite React SPA, and Hono serves JSON API routes plus the static `apps/web/dist` output.

## Stack

- `pnpm` workspaces for package management.
- `Turborepo` for workspace-level `dev`, `build`, `typecheck`, and `lint` orchestration.
- `TypeScript` across apps and packages.
- `Hono` with `@hono/node-server` for the API and production Node server.
- `React 19` with `Vite` for the client app.
- `TanStack Router` for client-side routing.
- `TanStack Query` for API data fetching and caching.
- `Tailwind CSS 4` through `@tailwindcss/vite`.
- Shared UI package using Radix Slot, class variance authority, `clsx`, `tailwind-merge`, and `lucide-react`.
- Shared contract package using `zod`.
- `Prisma 7` for database schema and migrations.
- `SQLite` for the current local database target.
- `Docker` and `docker compose` for the production build path.

## Monorepo Structure

```text
apps/
  api/       Hono API and production static-file server
  web/       Vite React SPA
packages/
  shared/    Shared Zod schemas and TypeScript types
  ui/        Shared UI components and styles
prisma/
  schema.prisma
  migrations/
scripts/
  ensure-sqlite-db.mjs
```

The API imports shared schemas from `@acme/shared`. The web app imports shared contracts and UI components from `@acme/shared` and `@acme/ui`.

## No SSR Configuration

Development runs as two separate processes:

- `apps/web` runs Vite on port `5173`.
- `apps/api` runs Hono on port `3000`.
- Vite proxies `/api` requests to `http://localhost:3000`.

Production is still not SSR. The web app is built to static files, and the API production server:

- serves `/api/*` through Hono routes,
- serves static assets from `apps/web/dist`,
- falls back to `index.html` for client-side routes.

## Prisma and SQLite

Prisma is configured in `prisma.config.ts`:

- schema path: `prisma/schema.prisma`
- migrations path: `prisma/migrations`
- datasource URL: `DATABASE_URL` from `.env`

The local database URL is:

```env
DATABASE_URL="file:./data/dev.db"
```

The initial schema defines one test model:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  userName String @map("user_name")

  @@map("users")
}
```

The generated SQLite table is `users` with `id` and `user_name` columns.

Use the project migration script:

```bash
pnpm prisma:migrate
```

`scripts/ensure-sqlite-db.mjs` creates the local SQLite file before running `prisma migrate dev`. The generated database files are ignored by Git.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm prisma:validate
pnpm prisma:migrate
```

Production Docker path:

```bash
docker compose up --build
```

The Docker image runs `prisma migrate deploy` before starting the production server. Compose passes `DATABASE_URL` to both the image build and runtime, defaulting to `file:./data/dev.db`, and mounts a named `sqlite-data` volume at `/app/data`, so the SQLite database survives container recreation. The API bundle inlines the local `@acme/shared` package so the production server does not need to execute workspace TypeScript source.

## Commit Checkpoints

1. `2d84d99 Initial Project Without Db and Orm`
   Created the base monorepo without Prisma or database configuration.

2. `cd67ca2 chore: add prisma core config`
   Added Prisma CLI/configuration as a checkpoint, without choosing a concrete database provider.

3. `34f095c feat: add sqlite prisma user migration`
   Added SQLite configuration, the `User` model, the initial migration, and the SQLite migration helper script.
