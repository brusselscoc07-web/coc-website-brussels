# Dependency Audit Triage

`npm audit` originally reported 12 high-severity findings against `next`'s bundled
`postcss`/`sharp`. **Do not run `npm audit fix --force`** — its only "fix" for those
is downgrading `next` to `9.3.3`, which would break the whole app.

## Fixed

Added `overrides` in `package.json` forcing the nested, vulnerable copies bundled
inside `next` up to patched versions, without touching `next` itself:

- `postcss` `8.4.31` → `^8.5.18` (fixes GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849)
- `sharp` `0.34.5` → `^0.35.0` (fixes GHSA-f88m-g3jw-g9cj / inherited libvips CVEs)

Verified with a clean `rm -rf node_modules package-lock.json && npm install` (so no
stale nested copy survives) and a full `npm run build` — both packages now resolve to
a single patched version tree-wide, build succeeds, `next`/`postcss`/`sharp` no longer
appear in `npm audit`.

`sharp` was the higher-priority fix of the two: `next/image` invokes it at
**request time**, so it's a real runtime attack surface once the site is live.
`postcss` only processes our own trusted CSS source at build time, but was cheap to
fix alongside it.

## Monitored, not fixed (accepted risk)

The remaining ~13 findings are entirely **devDependency-only build/lint tooling**,
never bundled into the deployed app and never reachable by a website visitor:

- `eslint` → `@eslint/config-array`/`@eslint/eslintrc` → `minimatch` → `brace-expansion`
  (ReDoS advisory) — only exercised when a developer runs `eslint` against this repo's
  own trusted source files, never fed attacker-controlled glob input.
- `drizzle-kit` → deprecated `@esbuild-kit/esm-loader` → `esbuild` (dev-server request
  advisory) — we never run esbuild's own `--serve` mode; drizzle-kit only uses it to
  transpile local config files.

Real fixes exist (`eslint@10`, `drizzle-kit@0.18.1`) but both are semver-major
downgrades/upgrades with breaking config changes, not worth doing for zero production
exposure. Re-run `npm audit` periodically and revisit if either package ships a
non-breaking patch, or when the team has bandwidth for an eslint 10 migration.

## Final re-check (end of backend build-out)

Re-ran `npm audit` after adding every backend dependency (drizzle-orm, drizzle-kit,
postgres, @electric-sql/pglite, zod, resend, iron-session, bcryptjs, @vercel/blob) —
still the same 13 findings, all in the eslint/drizzle-kit devDependency chain above.
None of the new runtime dependencies introduced anything, and `next`/`postcss`/`sharp`
remain clean. No action needed beyond what's documented above.
