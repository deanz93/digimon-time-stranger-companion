# Phase 6 implementation notes

## Delivered

- Authenticated cloud state sync
- 30-day hashed bearer sessions
- Companion backup export/import
- Safe native-save parser boundary
- Battle comparison calculator
- Approved artwork manifest importer
- Artwork rendering in Field Guide and detail pages
- GitHub Actions CI
- Vercel deployment workflow

## Native Time Stranger saves

The app accepts `.bin` and `.dat` for local inspection, but does not claim to parse the proprietary binary structure. The current UI reports a short header preview only. Implement a verified adapter later under the Save Import Lab rather than guessing byte offsets.

Known community tooling demonstrates that PC save editing is possible, but this codebase intentionally avoids coupling itself to undocumented offsets that may change between game versions.

## Security model

The account system is intentionally small:

1. Username is normalized to lowercase and restricted to a conservative character set.
2. Passwords must be at least 10 characters.
3. Passwords are stored as scrypt-derived hashes with random salts.
4. Session bearer tokens are random and only SHA-256 hashes are persisted.
5. Sessions expire after 30 days.
6. Save files are never sent to the sync API by the import page.

For a public high-traffic deployment, add rate limiting, HTTPS-only cookie sessions or a managed auth provider, password reset/recovery, audit logging and abuse controls.
