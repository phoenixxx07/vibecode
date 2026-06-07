# VibeCatalog.id

Katalog murni tools & proyek hasil vibe coder Indonesia. Developer dapat mendaftarkan proyek **live**, **prototype**, atau **repository GitHub**. Publik dapat mencari dan menjelajahi katalog. Pemesanan diarahkan langsung ke kontak developer.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS (terminal/cyber-brutalism theme)
- PostgreSQL + Prisma ORM
- NextAuth.js (Google OAuth)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL`
- `SEED_ADMIN_EMAIL` — admin user auto-created on seed
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — for OAuth login
- `NEXTAUTH_SECRET` / `AUTH_SECRET`

### 4. Migrate & seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

Admin user is auto-seeded from `SEED_ADMIN_EMAIL`. Login via Google OAuth with that email to access `/admin`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:deploy` | Deploy migrations (production) |
| `npm run db:seed` | Seed admin + master data |

## Project Structure

```
app/           # Next.js pages & API routes
components/    # UI components (terminal, catalog, admin)
lib/           # Prisma, auth, validators, product queries
prisma/        # Schema, migrations, seed
mockup-frontend/  # Original HTML mockups (reference)
```
