# Digimon Story: Time Stranger Companion — Complete TypeScript Edition

A full-stack TypeScript companion for **Digimon Story: Time Stranger**.

The responsive workspace includes the complete Field Guide, verified evolution routing and graph, active/reserve Team Builder with diversity suggestions, filtered Collection Tracker, evolution goals, comparison, evolution readiness and damage estimates, favorites with personal notes, recent activity, and live dataset coverage.

The Missions workspace at `/guide` provides a searchable completion tracker for 121 verified entries: 42 main missions, 32 optional missions across both time periods, 44 post-game missions, and three downloadable episode groups. Full third-party walkthroughs remain linked and attributed instead of being copied into the project.

Collection, team, favorites, goals, notes, and settings are stored locally and sync automatically for signed-in users. Dataset counts and the active version are read from the database; missing requirements remain blank rather than being guessed.

## Implemented

### Field Guide
- Search by name/type
- Filter by stage, attribute and type
- Field Guide number and DLC flags
- Detail page with stats, previous/next evolutions and requirements
- Interactive React Flow evolution graph

### Evolution Planner
- Shortest-path BFS
- Optional de-digivolution edges
- Per-step requirement display

### Team Builder
- Three-Digimon squad
- Attribute/type coverage summary
- Local browser persistence

### Collection Tracker
- Mark discovered Field Guide entries
- Completion percentage
- Local browser persistence

### Offline / PWA
- Web manifest
- Service worker and app-shell cache
- Snapshot export command for versioned static data

### Data pipeline
- Prisma + PostgreSQL (Neon compatible)
- Dataset version table
- Live TypeScript importer for the public GameFAQs Field Guide pages
- Dataset validation report
- JSON snapshot exporter

### Deployment
- Dockerfiles for API/Web
- Docker Compose with local PostgreSQL
- Neon-ready `.env.example`

## Stack
- Next.js 16 + React 19 + TypeScript
- NestJS 11 + TypeScript
- Prisma + PostgreSQL / Neon
- `@xyflow/react`
- pnpm + Turborepo

## Quick start with Neon

```bash
cp .env.example .env
# Add your Neon DATABASE_URL
corepack enable
corepack prepare pnpm@10.15.0 --activate
pnpm install
pnpm db:generate
pnpm db:migrate --name init
pnpm db:seed
pnpm dev
```

Web: `http://localhost:3000`  
API: `http://localhost:4000/api`

## Import the current Time Stranger Field Guide

The project contains an importer rather than copying an external guide into the repository. Run:

```bash
pnpm db:import:gamefaqs
pnpm db:validate
pnpm data:export
```

The importer visits the seven Field Guide stage pages, creates/upserts Digimon records, parses evolution links when exposed by the page tables, records source metadata, and activates the imported dataset version.

> External sites can change markup or block automated requests. If the importer reports fewer records/edges than expected, inspect the validation output before trusting the dataset.

## Local Docker stack

```bash
docker compose up -d postgres
cp .env.example .env
# For host-side Prisma commands use:
# DATABASE_URL=postgresql://dts:dts@localhost:5432/dts
pnpm db:generate
pnpm db:migrate --name init
pnpm db:seed
pnpm dev
```

## Data integrity

```bash
pnpm db:validate
```

Reports:
- total Digimon
- total evolution edges
- orphan edges
- duplicate Field Guide numbers
- isolated Digimon

## Data policy

Digimon names, game relationships, numeric stats and requirements are treated as factual reference data. The repository does **not** bundle third-party guide prose or copyrighted Digimon artwork. `imageUrl` is optional so artwork can be supplied separately where you have permission to use it.

## Phase 6 — Companion Plus

### Account & cloud sync
The API now includes a lightweight first-party account system with no external identity provider:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/sync`
- `PUT /api/sync`

Passwords are derived with Node.js `scrypt` and per-user random salts. Browser session tokens are random 256-bit values; only SHA-256 token hashes are stored in PostgreSQL. Cloud state covers collection, team, favorites and settings.

### Save Import Lab
`/import` supports export/restore of `dts-companion-export-v1` JSON. `.bin` and `.dat` files are inspected locally but are not decoded yet. Native Time Stranger parsing is deliberately held behind an adapter boundary until a reliable binary schema is verified.

### Battle Calculator
`/calculator` implements an explicitly experimental comparison model:

```text
Power × (Offense / Defense) × Level × multipliers
```

It is intended for relative build comparisons, not exact damage prediction.

### Artwork manifest
No third-party artwork is bundled. If you have an approved image source, prepare a manifest based on `docs/artwork-manifest.example.json` and run:

```bash
pnpm artwork:import ./my-artwork-manifest.json
```

### CI / deployment
GitHub Actions workflows are included for TypeScript/build validation and optional Vercel deployment. Configure `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as repository secrets before enabling the deploy workflow.

## Database update after upgrading from Phase 5

Phase 6 adds `User`, `Session` and `UserState` tables. Run:

```bash
pnpm db:generate
pnpm db:migrate --name phase6_cloud_sync
```

For Neon production, create and review the migration in development first, then use your normal Prisma production migration workflow.
# Cheat Workspace

Open `/cheats` to build version-safe cheat packages.

The Switch workspace includes an in-app HATS installation guide. It updates the displayed Title ID, Build ID, and SD-card destination when the user switches between the retail and Demo profiles, and explains export, installation, EdiZon activation, restore behavior, and common troubleshooting.

- Nintendo Switch 1.2.1 uses Title ID `010062E01FE0C000` and Build ID `8567DF0B7DC16822`. The bundled catalog merges five attributed source exports into 81 deduplicated selectable cheats, preferring Breeze 108.7b when older entries conflict. The importer converts raw labels into consistent display titles and generates a conservative plain-language description for every entry without changing its instruction bytes. Every export automatically includes the matching restore/master block. The HATS ZIP installs to `/atmosphere/contents/<TITLE_ID>/cheats/<BUILD_ID>.txt`.
- Nintendo Switch Demo 1.0.0 is a separate profile using Title ID `0100A15026080000` and Build ID `7E0AFD1097E8DADD`. Its EXP x9 and CP x256 entries are credited to TomSwitch and export only to the Demo-specific HATS path. Diagnostic read/reference instructions are archived but intentionally not shown as playable cheats.
- PS5 version `01.000.011` uses Title ID `PPSA24701`. Select entries and export an etaHEN-ready ZIP or JSON file. The package installs to `/data/etaHEN/cheats/json/`.
- Never use codes from another game version or region. Back up save data first. Additional user-provided Atmosphère entries can still be parsed locally.

To regenerate the Nintendo catalog, pass newest-to-oldest exported HTML files:

```bash
pnpm cheats:merge:switch newest.html older-1.html older-2.html --output apps/web/lib/switchCheats.generated.ts --archive-dir data/source/switch-cheats
```
