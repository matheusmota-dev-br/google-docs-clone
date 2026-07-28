<div align="center">

# Google Docs Clone

**A real-time collaborative document editor with no hosted dependencies — Yjs for collaboration, Keycloak for identity, Postgres for everything else. Turborepo monorepo, Storybook-documented design system, Atomic Design.**

[![CI](https://img.shields.io/github/actions/workflow/status/Matheus1714/google-docs-clone/ci.yml?branch=master&style=for-the-badge&label=CI)](https://github.com/Matheus1714/google-docs-clone/actions)
![Latest Release](https://img.shields.io/github/v/release/Matheus1714/google-docs-clone?style=for-the-badge)
![License](https://img.shields.io/github/license/Matheus1714/google-docs-clone?style=for-the-badge)

![Banner](.github/imgs/banner.png)

</div>

---

## What this repository is

Two things at once, and both are the point:

1. **A working product** — a Google Docs clone with a rich-text editor, live cursors, anchored comments, mentions, notifications, organisations and offline-tolerant editing.
2. **A reference monorepo** — how to run all of that on software you host yourself, split across a Turborepo workspace, with a design system documented in Storybook that never drifts from the product.

**Everything runs locally.** `docker compose` gives you Postgres and Keycloak; the rest is TypeScript in this repo. There is no account to create and no API key to paste.

The product is based on [Build a Real-Time Google Docs Clone With Next.js, React, Tailwind](https://www.youtube.com/watch?v=gq2bbDmSokU) by [Code With Antonio](https://www.youtube.com/@codewithantonio) — rebuilt on a self-hosted stack.

## Quick start

```bash
git clone https://github.com/Matheus1714/google-docs-clone.git
cd google-docs-clone

pnpm setup    # install, write .env files, start Postgres + Keycloak, migrate
pnpm dev      # web :3000 · api :4000 · collab :4001 · storybook :6006
```

Open <http://localhost:3000> and sign in with the account that ships in the realm:

| Email              | Password     | Workspaces   |
| ------------------ | ------------ | ------------ |
| **user@teste.com** | **senha123** | Acme         |
| maria@teste.com    | senha123     | Acme         |
| joao@teste.com     | senha123     | Acme, Globex |

Open a document as `user@teste.com` in one browser and as `maria@teste.com` in another to see cursors, presence and comments move between them. The Keycloak admin console is at <http://localhost:8088> (`admin` / `admin`).

> Storybook needs none of this — `pnpm storybook` runs on its own, because the design system has no data dependencies.

## Architecture

```
┌──────────────┐   REST + Bearer JWT    ┌──────────────┐
│              │ ─────────────────────► │  apps/api    │  NestJS
│  apps/web    │                        │              │  documents, members, inbox
│  Next.js 15  │   WebSocket + JWT      ├──────────────┤
│              │ ─────────────────────► │ apps/collab  │  Hocuspocus
└──────┬───────┘                        │              │  Yjs sync, presence, persistence
       │                                └──────┬───────┘
       │ OpenID Connect                        │  Prisma
       ▼                                       ▼
┌──────────────┐                        ┌──────────────┐
│  Keycloak    │                        │  Postgres    │
│  identity,   │◄───── admin API ───────│  documents,  │
│  groups      │                        │  Y.Doc state │
└──────────────┘                        └──────────────┘
```

Both back-end services validate the **same Keycloak access token** against the realm's JWKS. There is no second session store and no user table — `ownerId` is a Keycloak subject and an organisation is a Keycloak group.

### What replaced what

| Was                 | Now                            | Notes                                                             |
| ------------------- | ------------------------------ | ----------------------------------------------------------------- |
| Clerk               | **Keycloak** + Auth.js         | Groups become workspaces; the group claim rides in the token.     |
| Clerk Organizations | **Keycloak groups**            | Membership is decided by the token, never by a request parameter. |
| Convex              | **NestJS + Prisma + Postgres** | Documents, search and cursor pagination.                          |
| Liveblocks (CRDT)   | **Yjs + Hocuspocus**           | `apps/collab` persists the `Y.Doc` straight into Postgres.        |
| Liveblocks presence | **Yjs awareness**              | Same channel that draws the remote cursors.                       |
| Liveblocks Storage  | **`Y.Map`**                    | Page margins live in the document's `meta` map.                   |
| Liveblocks Comments | **Threads inside the `Y.Doc`** | Rebuilt from scratch — see below.                                 |
| Liveblocks Inbox    | **`notifications` table**      | Written by the collaboration server, polled by the bell.          |

### How commenting works

Comments were the one feature with no drop-in replacement, so they are built here:

- **The anchor** is a Tiptap mark (`packages/…/extensions/comment.ts`) carrying a `threadId`. Because it is a mark, it replicates through Yjs like any other formatting and follows the text as people edit around it.
- **The conversation** lives in the document's own `Y.Doc`, under a `threads` map defined by [`@repo/collab`](packages/collab/src/index.ts). That is what makes commenting realtime and offline-tolerant for free: threads merge exactly like the prose does, and Hocuspocus persists them in the same write.
- **The sidebar** measures where each anchor sits on screen and lines the cards up with it, stacking them when anchors crowd together.
- **Notifications** are the one part that cannot live in the document, because they are for people who are _not_ in it. After each save the collaboration server diffs the threads and writes inbox rows to Postgres.

### The login page

Keycloak owns the sign-in screen, so it gets the product's look too — see
[`infra/keycloak/themes/docs`](infra/keycloak/themes/docs).

The theme inherits every template from Keycloak's unstyled `base` theme, which
drives all of its markup through configurable class names. Remapping those in
`theme.properties` and shipping one stylesheet re-skins the **whole** login
flow — sign-in, password reset, OTP, error pages — without rewriting a single
FreeMarker template, so Keycloak upgrades stay cheap.

The palette is not copied by hand: `css/tokens.css` is generated from
`packages/ui/styles.css` by `pnpm theme:sync`, and CI fails if the two drift
apart. Inter is vendored into the theme so the page needs no font CDN.

> The card shows the demo credentials. That is one line — `docsDemoHint` in
> `theme.properties` — delete it for a real deployment.

## Layout

```
.
├── apps
│   ├── web          Next.js 15 — UI, Auth.js/Keycloak, Tiptap, Yjs client
│   ├── api          NestJS — documents, Keycloak member lookup, notifications
│   ├── collab       Hocuspocus — Yjs sync, persistence, notification mirroring
│   └── storybook    Storybook 10 — guides, token galleries, every component story
├── packages
│   ├── ui           @repo/ui — the design system (atoms → templates)
│   ├── collab       @repo/collab — the shape of a document's Y.Doc
│   ├── db           @repo/db — Prisma schema, client and the document access rule
│   ├── tailwind-config
│   ├── eslint-config
│   └── typescript-config
└── infra            docker-compose, the Keycloak realm and the login theme
```

### Atomic Design

`@repo/ui` is split into four layers, and the rule that makes the split useful is the **dependency direction** — a layer may import from the layers below it, never from above.

| Layer       | What belongs there                     | Examples                                                             |
| ----------- | -------------------------------------- | -------------------------------------------------------------------- |
| `atoms`     | One element, one job, no app knowledge | `Button`, `Input`, `Spinner`, `Logo`                                 |
| `molecules` | A few atoms that are useless apart     | `SearchField`, `CommentComposer`, `UserMenu`, `OrganizationSwitcher` |
| `organisms` | A recognisable section of the product  | `AppHeader`, `DocumentTable`, `ThreadSidebar`, `NotificationInbox`   |
| `templates` | Layout only — every region is a slot   | `AppShell`, `EditorShell`                                            |

The import path states the dependency:

```tsx
import { Button, Spinner } from "@repo/ui/atoms";
import { CommentComposer } from "@repo/ui/molecules";
import { ThreadSidebar } from "@repo/ui/organisms";
import { EditorShell } from "@repo/ui/templates";
```

**`apps/web` is not a fifth layer.** It holds the pages — the only place that knows about Keycloak, the REST API or the Yjs socket. Organisms receive plain props, which is why the same `ThreadSidebar` renders live Yjs threads in the app and fixtures in Storybook.

### Design tokens

Colour, radius and elevation live as CSS custom properties in [`packages/ui/styles.css`](packages/ui/styles.css) and are mapped onto Tailwind by [`packages/tailwind-config`](packages/tailwind-config/index.js). Components reference the **role** (`bg-primary`, `shadow-paper`), never a hex value — so dark mode is a single class on `<html>`, and Storybook's theme toggle exercises both.

## Scripts

| Command                                       | What it does                                             |
| --------------------------------------------- | -------------------------------------------------------- |
| `pnpm setup`                                  | Install, write env files, start services, run migrations |
| `pnpm dev`                                    | Every app in watch mode                                  |
| `pnpm dev:web` / `pnpm dev:backend`           | Just the front end / just `api` + `collab`               |
| `pnpm storybook`                              | Storybook on :6006                                       |
| `pnpm services:up` / `:down` / `:reset`       | Postgres + Keycloak (`:reset` also drops the volume)     |
| `pnpm db:migrate` / `db:deploy` / `db:studio` | Prisma                                                   |
| `pnpm lint` / `check-types` / `build`         | Turborepo-cached quality gates                           |
| `pnpm test:e2e`                               | Browser test of the full stack (see below)               |

### End-to-end test

[`apps/web/e2e/collaboration.mjs`](apps/web/e2e/collaboration.mjs) drives a real Chrome through the parts that are only true when every service is talking to the others: it signs two people in through Keycloak, creates a document, and checks that text, comments and presence cross between the two sessions and that the collaboration server files the resulting notification.

```bash
pnpm services:up && pnpm dev     # in one terminal
pnpm test:e2e                    # in another
```

## Ports

| Service            | Port     | Why not the usual one                                |
| ------------------ | -------- | ---------------------------------------------------- |
| Web                | 3000     |                                                      |
| API                | 4000     |                                                      |
| Collab (WebSocket) | 4001     |                                                      |
| Storybook          | 6006     |                                                      |
| Postgres           | **5442** | Leaves the conventional 5432 free for other projects |
| Keycloak           | **8088** | Same reasoning for 8080                              |

## Tech stack

| Area          | Choice                                                   |
| ------------- | -------------------------------------------------------- |
| Monorepo      | Turborepo + pnpm workspaces                              |
| Web           | Next.js 15 (App Router), React 19                        |
| API           | NestJS 11, Prisma 6, PostgreSQL 17                       |
| Collaboration | Yjs + Hocuspocus 4                                       |
| Identity      | Keycloak 26 (OIDC) + Auth.js v5                          |
| Editor        | Tiptap 2                                                 |
| UI            | Tailwind CSS 3, Radix UI, shadcn-style components        |
| Docs          | Storybook 10 (React + Vite), a11y and theme addons       |
| Quality       | ESLint 9 flat config, TypeScript 5, Prettier, Playwright |

## Adding a component

1. Decide the layer (see the table above; if it imports a data client, it belongs in `apps/web` instead).
2. Create `packages/ui/src/<layer>/<name>.tsx`.
3. Add `export * from "./<name>";` to that layer's `index.ts`.
4. Write `<name>.stories.tsx` next to it — stories live beside their component so they get renamed, moved and reviewed together.
5. `pnpm lint && pnpm check-types`.

## Known gaps

- **Auth.js v5 is a beta release.** It is the standard OIDC client for the App Router and has been stable in practice for a long time, but the version is pinned exactly for that reason.
- **The document list is not live.** Convex pushed changes; with a plain REST API the list revalidates on focus and after mutations. Comments and the document body _are_ live, over Yjs.
- **Notifications are polled** every 20 seconds. Fine for a bell icon; swap for SSE if you want them instant.
- **Organisation invites** are managed in the Keycloak console rather than in-app, since groups are the source of truth.

## License

[MIT](LICENSE.md)
