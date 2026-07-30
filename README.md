# Church of Christ Brussels Website

A Next.js 16 (App Router) website for Church of Christ Brussels, with a full custom backend: a real database, an admin dashboard for staff to manage content, comment moderation, sermon reactions, a livestream toggle, and rate limiting and other security measures on every public form.

This document explains what has been built, how everything fits together, how to run the project locally, what security work has been done, and what is still left to do. It is written so a collaborator can pick up the project and start contributing without needing a walkthrough first.

## Table of contents

1. [Current status](#current-status)
2. [Tech stack](#tech-stack)
3. [Running it locally](#running-it-locally)
4. [Project structure](#project-structure)
5. [Core architecture idea: build now, bind real accounts later](#core-architecture-idea-build-now-bind-real-accounts-later)
6. [Database schema](#database-schema)
7. [Feature walkthrough](#feature-walkthrough)
8. [Admin dashboard](#admin-dashboard)
9. [Security work done](#security-work-done)
10. [Important technical gotcha: PGlite and Server Actions](#important-technical-gotcha-pglite-and-server-actions)
11. [Available npm scripts](#available-npm-scripts)
12. [Environment variables](#environment-variables)
13. [What is left to do](#what-is-left-to-do)
14. [Deploying](#deploying)

## Current status

The site is fully functional end to end, using a local, zero-account database and local file storage as stand-ins for the real production services. Every feature described below has been built and manually tested through real HTTP requests against a running server, not just written and assumed to work.

The only remaining step is what we call "account binding day": creating the real Neon (Postgres), Vercel Blob, and Resend accounts as a team, and setting three environment variables. No code changes are needed for that step. See [What is left to do](#what-is-left-to-do).

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server Components, Server Actions, route handlers |
| UI | React 19, Tailwind CSS 4 | Custom color palette defined in `app/globals.css` |
| Database | Postgres, via Drizzle ORM | PGlite locally (see below), real Postgres in production |
| Local dev database | PGlite (`@electric-sql/pglite`) | An embedded Postgres engine that runs in process, no install or account needed |
| File storage | Vercel Blob in production, a local `uploads/` folder in dev | Same interface either way, see `lib/storage.ts` |
| Email | Resend in production, console logging in dev | Same interface either way, see `lib/email.ts` |
| Admin authentication | Hand rolled: bcrypt password hashing plus iron-session cookies | Not Auth.js, this is a small single tenant admin, not a multi tenant SaaS |
| Validation | Zod | Used on every form submission and on environment variable parsing |
| Rate limiting | A Postgres backed sliding window table | No Redis or Upstash account needed |

## Running it locally

### Prerequisites

- Node.js 20 or later
- npm

That is it. No Docker, no database server, no external accounts. The project runs entirely on your machine out of the box.

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your local environment file**

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and set `SESSION_SECRET`. This is the only variable that is required even in local development, because it signs admin session cookies and visitor cookies. Generate one with:

   ```bash
   openssl rand -base64 32
   ```

   Paste the output as the value of `SESSION_SECRET` in `.env.local`. Leave every other variable in that file blank. See [Environment variables](#environment-variables) for what each one does and why they can stay empty locally.

3. **Run the database migration**

   ```bash
   npm run db:migrate
   ```

   The first time you run this, it creates a local PGlite database file under `.data/pglite/` (already gitignored) and creates all the tables. You only need to run this again after a schema change (see `lib/db/schema.ts` and `lib/db/migrations/`).

4. **Seed the database with starter content**

   ```bash
   npm run db:seed
   ```

   This copies the original hardcoded sermons, events, and photo albums from `lib/data.ts` into the database, so the site is not empty on first run.

5. **Create an admin account**

   ```bash
   ADMIN_SEED_EMAIL="you@example.com" ADMIN_SEED_PASSWORD="a-password-at-least-12-characters" npm run db:seed-admin
   ```

   This script is idempotent: running it again with the same email updates that admin's password instead of creating a duplicate, so it is safe to rerun whenever you need to reset a password.

6. **Start the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin/login` to sign in with the account you just created.

That is the whole setup. Every subsequent `npm run dev` just works, using the same local PGlite file, until you delete `.data/pglite/`.

### A note on how the local database behaves

PGlite stores its data in `.data/pglite/`, a folder on disk, not a separate running process. This means:

- Only one process should touch it at a time. If you run a `db:*` script while `npm run dev` is running, you may see a file lock issue. Stop the dev server first, run your script, then restart the dev server.
- Deleting `.data/pglite/` gives you a completely fresh, empty database. Run `npm run db:migrate` and `npm run db:seed` again afterward.
- This is purely a local development convenience. Production will use a real, always on Postgres server (see [Core architecture idea](#core-architecture-idea-build-now-bind-real-accounts-later)), which does not have this limitation.

## Project structure

```
app/
  page.tsx                       Homepage
  about/                         About Us page
  contact/                       Contact page and its Server Action
  join/                          Join Us page (reuses the contact form)
  sermons/                       Public sermon list and detail pages
    [slug]/actions.ts            submitComment Server Action
    [slug]/reactions.ts          toggleReaction Server Action
  events/                        Public event list and detail pages
  gallery/                       Public photo album list and detail pages
  admin/
    login/                       Admin login page and its Server Action, NOT behind auth
    (authenticated)/             Everything here requires a valid session, see proxy.ts
      layout.tsx                 Shared admin nav bar
      page.tsx                   Admin dashboard home
      sermons/ events/ albums/   CRUD pages for each content type (sermons/ is labeled
                                  "Resources" in the nav, it manages Sermons, Thought
                                  for the Week posts, and Bible Teachings studies together)
      comments/                  Comment moderation queue
      livestream/                Livestream on/off toggle
  api/
    uploads/[key]/route.ts       Serves locally stored images in dev
    search-index/route.ts        JSON endpoint the header search box fetches from

components/
  (public site components, one file per component, e.g. SiteHeader.tsx, HeroCarousel.tsx)
  admin/                         Shared admin form components (SermonForm, EventForm, etc.)

lib/
  db/
    schema.ts                    The full Drizzle schema, every table is defined here
    index.ts                     getDb(), the one place the database connection is created
    migrations/                  Auto-generated SQL migration files, do not hand edit
  auth/                          Password hashing, session cookie handling, the admin auth guard
  validation/                    One Zod schema file per form (contact, comment, sermon, event, album)
  data.ts                        Static site content that is NOT in the database: nav links, church
                                  address and service times, social links, hero slides. Also still
                                  holds the ORIGINAL hardcoded content arrays, which scripts/seed.ts
                                  reads from to populate the database.
  db.ts references: storage.ts, email.ts, rate-limit.ts, timezone.ts, format.ts, settings.ts,
                     visitor.ts, upload.ts, reaction-kinds.ts
  env.ts                         Zod-validated environment variable loader

scripts/
  migrate.ts                     Applies pending migrations
  seed.ts                        Copies lib/data.ts content into the database
  seed-admin.ts                  Creates or updates an admin user

middleware / proxy.ts            Gates every /admin/* route except /admin/login
drizzle.config.ts                Drizzle Kit configuration, used by `npm run db:generate`
```

## Core architecture idea: build now, bind real accounts later

When this backend was built, the team had not yet decided which real hosting accounts to use (which Postgres provider, whether to use Vercel Blob or something else, which email provider). Rather than block backend development on that decision, every external service was built behind a small adapter with a working, zero-account local substitute. The application code never branches on which one is active, it just calls the adapter function.

| Adapter | File | Local behavior | Production behavior |
|---|---|---|---|
| Database | `lib/db/index.ts` | PGlite, an embedded Postgres that needs no install | Real Postgres, connected via `DATABASE_URL` |
| File storage | `lib/storage.ts` | Writes to a local `uploads/` folder, served by `app/api/uploads/[key]/route.ts` | Vercel Blob, connected via `BLOB_READ_WRITE_TOKEN` |
| Email | `lib/email.ts` | Logs the email contents to the server console instead of sending it | Resend, connected via `RESEND_API_KEY` |

Each adapter picks its mode automatically based on whether the relevant environment variable is set. There is no code path that needs to change when the team creates real accounts, only environment variables need to be added (see [What is left to do](#what-is-left-to-do)).

The one exception is rate limiting, which was deliberately built directly on top of Postgres (a `rate_limit_hits` table) rather than a separate Redis or Upstash service, so the team never has to choose or pay for that vendor at all, in development or in production.

## Database schema

Full definitions live in `lib/db/schema.ts`. Summary of every table:

- **admin_users**: staff accounts. Email, bcrypt password hash, role, failed login counter and lockout timestamp for brute force protection.
- **sermons**: id is a URL slug. Title, date, preacher, scripture reference, category (one of Sermon, Thought for the Week, or Bible Teachings, see [Admin dashboard](#admin-dashboard)), excerpt, body (an array of paragraphs), whether it has a video, video URL, image URL.
- **comments**: belongs to a sermon. Name, optional email (never shown publicly), text, and a status of pending, approved, or rejected. Only approved comments are shown on the public site.
- **reactions**: belongs to a sermon. One row per visitor per sermon (a unique constraint enforces this), kind is heart, pray, or amen. Visitor identity comes from a signed cookie, see `lib/visitor.ts`.
- **events**: id is a URL slug. Title, start date, an optional custom date label for multi day events (for example "August 14-16, 2026"), time, description, location, image URL, and a precise UTC instant for events with a normal clock time, used to show the event time converted into each visitor's own timezone.
- **albums**: id is a URL slug. Title and date.
- **photos**: belongs to an album. Image URL, optional caption, sort order.
- **settings**: a small key and value table. Currently holds one row, key `livestream`, used for the on air toggle.
- **contact_submissions**: every contact form message, stored in the database as well as emailed, so nothing is lost if the email provider has an outage.
- **rate_limit_hits**: timestamps used to implement the sliding window rate limiter, see `lib/rate-limit.ts`.

Note that `events.past` is deliberately NOT a stored column. Whether an event is upcoming or past is computed at query time by comparing its date to the current date, so it can never go stale.

## Feature walkthrough

### Public site

All public pages (`/`, `/about`, `/contact`, `/join`, `/sermons`, `/events`, `/gallery`, and their detail pages) read live data from the database using Drizzle queries directly inside async Server Components. There is no separate API layer for the public site, the page component queries the database and renders the result.

### Homepage highlights

The homepage shows three cards below the hero and livestream section: Latest Sermon, Next Event, and Thought For The Week. All three are real links into the site and all three are sourced live from the database on every request, there is no hardcoded content left in this row.

The Thought For The Week card specifically shows the most recently published resource whose category is "Thought for the Week" (its title, scripture reference, and excerpt), and links to that resource's full page. This card used to show a fixed, hardcoded Bible verse with no connection to the admin dashboard at all. It has been rewired so that publishing a new Thought for the Week post through the admin Resources section (see [Admin dashboard](#admin-dashboard)) updates this card immediately, with no code change or rebuild needed. If no Thought for the Week post exists yet, the card simply does not render.

### Contact form

`components/ContactForm.tsx` (used on both `/contact` and `/join`) posts to a Server Action in `app/contact/actions.ts`. The action:

1. Rate limits by IP address (5 submissions per 10 minutes).
2. Validates the input with Zod (`lib/validation/contact.ts`).
3. Inserts a row into `contact_submissions`.
4. Sends an email via `lib/email.ts` to the address configured by `CONTACT_NOTIFY_EMAIL`.

If the email send fails, the database row is not rolled back, the message is still saved and visible in a future admin inbox. The DB write and the email send are intentionally decoupled so an email outage never loses a message.

### Sermon comments

Visitors can leave a comment on any sermon page. The form posts to `submitComment` in `app/sermons/[slug]/actions.ts`, which rate limits (5 per 10 minutes per IP), validates, and inserts the comment with `status: 'pending'`. The public page only ever queries for comments where `status = 'approved'`, so a new comment does not appear until a staff member approves it in the admin dashboard.

Comment text is rendered through normal JSX interpolation, never `dangerouslySetInnerHTML`, so it is automatically HTML escaped. This was verified by submitting a comment containing an actual `<script>` tag and confirming it renders as literal text everywhere, including the admin moderation view.

### Sermon reactions

Each sermon has three reaction buttons: heart, pray, amen. Clicking one calls `toggleReaction` in `app/sermons/[slug]/reactions.ts` directly from the browser (not through a form), which:

1. Rate limits (20 per minute per IP, generous because switching between reactions is normal behavior).
2. Reads or creates a signed, anonymous `visitor_id` cookie (`lib/visitor.ts`), so no login is needed to react.
3. Inserts, updates, or deletes that visitor's reaction row for that sermon.
4. Returns the fresh counts, which the browser applies immediately.

A database level unique constraint on `(sermon_id, visitor_id)` is the real backstop against double counting, even if someone clears cookies and gets a new visitor id, that only lets them react once more from a browser's perspective, it does not let the same cookie react twice.

### Events

Event dates are stored as a real date column, so the site can always correctly compute which events are upcoming versus past, and sort them correctly, even though the original design also allows a free text "date label" for events that span multiple days.

Every event also gets a precise UTC timestamp calculated from its date and time, treating the time as Brussels local time (see `lib/timezone.ts`). This timestamp correctly accounts for whether Brussels is on CET or CEST (winter or summer time) on that specific date. It is used to show the event's start time converted to whatever timezone the visitor's browser reports, right next to the Brussels time, so there is never a doubt about what time something is for someone watching or attending from outside Belgium.

### Photo galleries

Albums and photos are fully database backed. The admin album management page lets staff add photos (uploaded, not linked) and delete individual photos or whole albums.

### Livestream toggle

The homepage shows either a "we are live" or "we are not live" state, sourced from the `settings` table (key `livestream`). This used to be a manual, client side preview switch used only for design purposes, it is now driven by an admin controlled database value, changed from `/admin/livestream`. The toggle does not start or stop an actual stream, it only controls what message the website shows visitors, the actual Zoom call is still started separately by church staff.

### Search

The header search box fetches its index from `app/api/search-index/route.ts`, a route handler that queries live sermon and event titles and excerpts from the database, plus a few hardcoded static pages (About, Join, Contact). It is fetched lazily by the browser, only the first time a visitor opens the search box, not on every page load, and only client side, so it never blocks page rendering. This means a sermon or event added through the admin dashboard shows up in site search immediately, with no rebuild needed.

## Admin dashboard

Everything under `/admin` except `/admin/login` requires a valid session. This is enforced twice, in two different layers, deliberately:

1. `proxy.ts` (Next.js middleware) checks for a valid session cookie on every request whose path starts with `/admin`, and redirects to `/admin/login` if it is missing or invalid. This is Next.js's proxy naming convention as of version 16, what used to be called `middleware.ts`.
2. Every admin Server Action also independently calls `requireAdminSession()` (`lib/auth/require-admin.ts`) before doing anything. This is defense in depth: even if a future refactor accidentally exposed an admin action from an unprotected page, the action itself would still refuse to run without a valid session.

### What staff can do

- **Resources** (`/admin/sermons`): create, edit, delete. This one section manages three public facing content types together: Sermons, Thought for the Week posts, and Bible Teachings studies. They are all rows in the same underlying sermons table, distinguished only by a Category field in the form (see `lib/validation/sermon.ts` for the allowed values). The list page has filter tabs, All, Sermon, Thought for the Week, Bible Teachings, matching the category filter already on the public Resources page, so staff can find and manage entries of a specific type. Upload an image. The slug (used in the resource's URL) can only be set at creation time, it cannot be changed afterward, because comments and reactions are linked to that slug and changing it would silently orphan or delete them.
- **Events** (`/admin/events`): create, edit, delete, same slug rule as resources above.
- **Albums** (`/admin/albums`): create and edit an album's title and date, then manage its photos from the same page: add a photo (with an optional caption), or delete any individual photo.
- **Comments** (`/admin/comments`): approve or reject pending comments. Already reviewed comments can be moved back to pending if a mistake was made.
- **Livestream** (`/admin/livestream`): toggle the homepage's live or offline state.

### Admin authentication details

- Passwords are hashed with bcrypt at cost factor 12.
- Sessions are encrypted, signed cookies (iron-session), `httpOnly`, `sameSite: lax`, and `secure` in production (verified by actually running a production build and inspecting the `Set-Cookie` header).
- After 5 failed login attempts for the same account, that account is locked for 15 minutes, independent of who is trying or from where.
- Login attempts are also rate limited by IP address (10 per 10 minutes), separately from the per-account lockout, to blunt an attacker trying many different email addresses from one IP.
- A login attempt for an email address that does not exist still runs a dummy password comparison before returning an error, so the response time does not reveal whether that email has an account (a timing side channel).

## Security work done

This section exists so a reviewer or new contributor can see exactly what has been done without re-auditing the codebase.

- **Input validation**: every form submission is validated with Zod before it touches the database. Schemas live in `lib/validation/`. Text fields have maximum length caps to prevent abuse.
- **Rate limiting**: contact form, comment submission, reaction toggling, and admin login are all rate limited using a Postgres backed sliding window (`lib/rate-limit.ts`). Verified by scripting six rapid contact form submissions and confirming the sixth is rejected.
- **CSRF protection**: Server Actions are origin checked by Next.js automatically. This was confirmed during testing: a raw `curl` request without a browser-supplied `Origin` header produces a visible warning in the server log.
- **XSS protection**: all user submitted text (comments, contact messages) is rendered through normal JSX, never `dangerouslySetInnerHTML`. Verified by submitting a comment containing a real `<script>` tag and confirming it never executes and always renders as escaped text, both in the admin view and the public page.
- **File upload validation**: uploaded images are checked by their actual byte signature (the first few bytes of the file), not by the filename extension or the browser supplied Content-Type header, both of which are fully attacker controlled. This was not the original implementation: an earlier version trusted the declared Content-Type, and a manual penetration test during development successfully uploaded a PHP script disguised as a `.jpg` file. That test caught the bug, and `lib/storage.ts` was rewritten to sniff the actual file bytes (checking for real JPEG, PNG, or WebP signatures) before accepting any upload. The upload serving route also sends `X-Content-Type-Options: nosniff` as a second layer of defense.
- **File upload size limits**: 8 megabytes maximum, enforced before the file is read into memory.
- **Admin authentication hardening**: see the admin authentication details above (bcrypt, session cookie flags, account lockout, IP rate limiting on login, timing-safe handling of nonexistent accounts).
- **Secrets management**: all secrets live in `.env.local`, which is gitignored. Only `.env.example`, containing placeholder key names with no real values, is committed. `lib/env.ts` validates required environment variables with Zod at startup, so a misconfigured deployment fails immediately and loudly instead of misbehaving silently at request time.
- **Dependency auditing**: `npm audit` findings were triaged, not blindly auto-fixed. Two real, production-relevant vulnerabilities (in `postcss` and `sharp`, both bundled transitively inside Next.js itself) were fixed using a targeted `overrides` entry in `package.json`, without downgrading Next.js. The remaining findings are entirely in development-only tooling (`eslint` and `drizzle-kit`'s dependency trees) that never ships to production and is never reachable by a website visitor, so they are documented as an accepted, monitored risk rather than fixed with a breaking major version upgrade. Full reasoning is in `SECURITY-NOTES.md`.
- **Anonymous visitor identification**: the cookie used to deduplicate sermon reactions (`lib/visitor.ts`) is HMAC signed using the same secret as admin sessions, so it cannot be trivially forged by editing `document.cookie` in a browser console. The real backstop against abuse is a database level unique constraint, not the cookie itself.

## Important technical gotcha: PGlite and Server Actions

This is documented here because it will matter again if a future feature has the same shape, and the fix is not obvious from the symptom.

**The problem**: PGlite is a single, in-process database engine. It is not designed to handle two queries that overlap in time on the same connection. Next.js Server Actions, when used with `useActionState` on a page that also reads from the database during its own render, can trigger exactly that overlap: the action's own database write, followed immediately (before that write's connection work has fully settled) by Next.js automatically re-rendering the same page in place to reflect the new form state, which issues its own fresh database reads.

This was discovered while building sermon comments. Submitting a comment would hang the entire dev server indefinitely, with the server process pinned at high CPU. Logging inside the action proved the insert itself completed successfully every time, the response back to the browser was what never arrived. Real Postgres, used in production, does not have this limitation, it handles concurrent connections natively, so this issue is specific to local development with PGlite.

**The fix, used in two different ways depending on the feature**:

1. **Comments** (`app/sermons/[slug]/actions.ts`): the action now calls `redirect()` on success instead of returning state for React to re-render in place. This is the Post/Redirect/Get pattern: a redirect ends that request cleanly, and the browser's next page load is a genuinely separate request, so there is no overlap. This is also just good practice on its own, refreshing the page after a redirect does not resubmit the form.
2. **Reactions** (`app/sermons/[slug]/reactions.ts`): the toggle function is called directly from a button's `onClick` handler in the browser, not wired through a `<form action={...}>` and `useActionState`. Calling a Server Action as a plain function like this does not trigger Next.js's automatic same-page re-render at all, so there is nothing to overlap with. The browser applies the returned counts to its own local state.

**If you build a new feature that both writes to the database and lives on a page that reads from the database**, use one of these two patterns, not the default `useActionState` plus in place re-render pattern, at least until the project has moved off PGlite in every environment.

## Available npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local development server on `http://localhost:3000` |
| `npm run build` | Builds a production bundle, also type checks the whole project |
| `npm run start` | Runs a previously built production bundle |
| `npm run lint` | Runs ESLint |
| `npm run db:generate` | Reads `lib/db/schema.ts` and generates a new SQL migration file if the schema changed. Run this after editing the schema. |
| `npm run db:migrate` | Applies any pending migrations to whichever database is configured (PGlite locally, real Postgres if `DATABASE_URL` is set) |
| `npm run db:studio` | Opens Drizzle Studio, a visual browser for the database |
| `npm run db:seed` | Copies the original hardcoded content from `lib/data.ts` into the database. Safe to run more than once, it updates existing rows instead of duplicating them. |
| `npm run db:seed-admin` | Creates or updates an admin account. Requires `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` environment variables, see [Running it locally](#running-it-locally) |

## Environment variables

All of these are documented with comments in `.env.example`, copy that file to `.env.local` to get started. Summary:

| Variable | Required locally | What happens if it is unset |
|---|---|---|
| `SESSION_SECRET` | Yes, always | The app will not start. This has no safe fallback because it is what secures admin sessions. Generate one with `openssl rand -base64 32`. |
| `DATABASE_URL` | No | Falls back to a local PGlite file under `.data/pglite/` |
| `RESEND_API_KEY` | No | Falls back to logging emails to the server console instead of sending them |
| `EMAIL_FROM` | No | Defaults to a placeholder Resend sandbox address |
| `CONTACT_NOTIFY_EMAIL` | No | Defaults to a placeholder address, set this to wherever the church office should receive contact form messages |
| `BLOB_READ_WRITE_TOKEN` | No | Falls back to writing uploaded images to a local `uploads/` folder, served by `app/api/uploads/[key]/route.ts` |
| `APP_ENV` | No | Only matters for a real deployment. When set to `production` (or when running on Vercel, which sets its own `VERCEL` variable automatically), the app requires `DATABASE_URL`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, and `CONTACT_NOTIFY_EMAIL` to all be set, and refuses to start otherwise. This exists so a real deployment can never silently run on local fallbacks by accident. |

## What is left to do

The backend is functionally complete. The single remaining task is what we call "account binding day":

1. Create a Neon (or any standard Postgres) account and database, and set `DATABASE_URL`.
2. Create a Vercel Blob store, and set `BLOB_READ_WRITE_TOKEN`.
3. Create a Resend account, verify a sending domain, and set `RESEND_API_KEY` and `CONTACT_NOTIFY_EMAIL`.
4. Run `npm run db:migrate` once against the real database to create all the tables.
5. Optionally run `npm run db:seed` and `npm run db:seed-admin` against the real database too, or manually create the first real admin account.

No application code needs to change for any of this. Every adapter already checks for these environment variables and switches automatically, see [Core architecture idea](#core-architecture-idea-build-now-bind-real-accounts-later).

### Smaller, optional follow ups

These are not blocking, just worth knowing about:

- `npm audit` currently reports findings entirely inside development only tooling (`eslint` and `drizzle-kit`'s dependency trees), never shipped to production. See `SECURITY-NOTES.md` for the full reasoning. Revisit if the team ever does an ESLint 10 migration.
- The admin dashboard has no password reset flow (an admin resets a password by rerunning `npm run db:seed-admin`). This was judged acceptable for a two or three person staff, revisit if the admin list grows.
- There is no automated test suite. All verification so far has been done manually, by exercising real HTTP requests against a running server. Adding Vitest coverage for the Zod validation schemas and the visitor cookie signing logic would be a reasonable, cheap first step if the project wants automated tests.

## Deploying

The application is written to be portable, but was designed with a Vercel-shaped deployment in mind (Vercel for hosting, Neon for Postgres, Vercel Blob for file storage). Once account binding day is done, deploying to Vercel should work with no special configuration beyond setting the environment variables listed above in the Vercel project settings, plus `APP_ENV=production` on any host other than Vercel itself (Vercel sets its own equivalent variable automatically).
