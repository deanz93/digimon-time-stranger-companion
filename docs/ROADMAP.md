# Roadmap Status

## Phase 1 — Foundation ✅
Monorepo, Next.js, NestJS, Prisma/PostgreSQL, search/detail graph, planner API.

## Phase 2 — Dataset pipeline ✅
Live Field Guide importer, normalized schema, evolution requirements model, version metadata, validation and snapshot export.

## Phase 3 — UX ✅
Search/filter Field Guide, stage-based React Flow layout, requirements, planner UI, navigation and responsive layout.

## Phase 4 — Offline/PWA ✅
Manifest, service worker app-shell caching, static snapshot export and local browser state.

## Phase 5 — Advanced ✅
Three-slot team builder, collection tracker, DLC flags/versioning and bidirectional evolution planning.

## Phase 6 — Companion Plus ✅
Authenticated cloud sync using username/password + scrypt, hashed bearer sessions, Battle Calculator, local-only Save Import Lab, approved artwork manifest importer and GitHub Actions CI/Vercel deployment workflow.

## Safety boundary for native game saves
The save import architecture is complete, but proprietary `.bin`/`.dat` parsing remains intentionally disabled until the binary schema is verified. The UI accepts and restores the companion's own JSON export format without uploading the file.

## Optional future enhancements
Verified native PC save adapter, skill database, equipment database, encounter/location database, and richer battle formula once a reliable specification is available.
