# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**tanstack-start-starter** is a TanStack Start (SSR, full-stack) starter for apps that need server-side operations, API routes and middleware. oRPC procedures are the single server API: the app calls them through `orpc` — in-process during SSR, over `/api/rpc` in the browser — and external consumers use the OpenAPI surface at `/api/*`.

How each area works today, and what is still missing, lives in `.claude/rules/` (see "Detail per area" below). Read the "Known gaps and leftovers" section of the matching file before assuming an oddity is intentional.

## Response language

- **Default: Bahasa Indonesia.** Always reply in Indonesian unless a flag says otherwise.
- `--en` in the prompt → reply in English for that turn.
- `--id` in the prompt → reply in Indonesian (explicit form of the default).
- Absent any flag, fall back to Indonesian — never switch to English just because the prompt, code, or file contents are in English.
- **Technical terms stay English even in Indonesian replies.** Don't translate API names, library terms, or technical nouns — write "server", "route", "query key", "loader", "middleware", "procedure", not "peladen", "rute", "kunci kueri", "pemuat", "perantara", "prosedur". The sentence structure is Indonesian; the vocabulary of the stack is not.

## UI copy language

**All user-facing text is written in Bahasa Indonesia** — labels, headings, placeholders, button text, error and empty-state messages, `aria-label`, toast copy, page titles. Domain/technical terms stay English (e.g. Dashboard, Login, Username, Export); URL paths are never translated, and values that come from data (roles, statuses) are not translated.

- Applies to every page route and every component it renders.
- This rule is only about text that reaches the screen. For comments, see [Code comments](#code-comments).

## Verification policy

**Never run any command other than `pnpm validate:full` to verify work.** No `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm start`, `pnpm lint`/`format`/`check` on their own, no ad-hoc `tsc`, no dev server, no requests against API routes, no browser checks.

The only exceptions:
- The user explicitly asks for a specific command to be run.
- The prompt contains the `--full-test` flag, which unlocks the broader verification commands (build, preview, start, dev server, `curl` against API routes, etc.).

## Git policy

- **Never run `git commit` or `git push`** — including variants like `git commit --amend` and `git push --force`. Both are the user's job, since they review the code first.
- Read-only git commands (`status`, `diff`, `log`, `show`) are allowed.
- When finished with a task, report the changed files and stop.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm dev` — Vite dev server on port 3111 (SSR, server routes and server functions included)
- `pnpm build` — production build (`vite build`); Nitro writes the server to `.output/`
- `pnpm start` — run the built server (`.output/server/index.mjs`) on port 3111
- `pnpm preview` — build, then `vite preview` on port 3111
- `pnpm generate-routes` — regenerate `src/routeTree.gen.ts` via `tsr generate` (see the Start caveat in `.claude/rules/routing.md`)
- `pnpm format` — Biome format check
- `pnpm lint` — Biome lint check
- `pnpm check` — Biome format + lint check
- `pnpm validate` — Biome check with `--write --unsafe` (auto-fixes, including unsafe fixes)
- `pnpm validate:full` — `pnpm validate` followed by `tsc --noEmit` — **the only command to run for verification** (see Verification policy above)

There is no test runner configured in this repo (no Vitest/Jest, no `test` script).

Biome is the only linter/formatter — there is no ESLint or Prettier config to reconcile with.

TanStack packages are pinned to exact versions, and those versions are listed under `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` (exemptions from pnpm's minimum-release-age check). Bumping them means updating that list too.

## Server primitives

Which primitive to reach for:

| Need | Use |
| --- | --- |
| App data and the public API | oRPC procedure in `src/router/` — the app calls it through `orpc`, external consumers through OpenAPI at `/api/*` |
| A raw HTTP contract: webhook, file download, third-party callback | Server route: `createFileRoute(...)({ server: { handlers } })` |
| Server work that belongs to the Start app: session cookie, `throw redirect()` / `notFound()` from `beforeLoad` or loaders, SSR response headers | `createServerFn` in `src/actions/<name>.functions.ts` — never a copy of a procedure |
| Authentication/authorization, rate limits, per-procedure context | oRPC middleware (`.use(...)`) — runs on every call path |
| Something for every request — SSR documents, server routes, server functions (logging, request id, security headers) | Start request middleware (`createMiddleware().server(...)`), registered in `src/start.ts` |
| Concerns of the actions (e.g. loading the session) | Start function middleware (`createMiddleware({ type: 'function' })`) |
| Redirecting signed-out users away from a page | `beforeLoad` calling an action — UX only |

## Data layers

Strictly one-directional — schemas → services → procedures → clients → route/component:

| Layer | Location | Responsibility | Must not |
| --- | --- | --- | --- |
| Schema | `src/schemas/<name>.schema.ts` | Zod input/output shapes + inferred types; client-safe | Import server code, know about oRPC or React Query |
| Service | `src/services/<name>.server.ts` | Server-only business logic: database, external APIs, secrets (read at call time) | Know about oRPC, HTTP or React; be imported from client-reachable code |
| Procedure | `src/router/<resource>.ts`, registered in `src/router/index.ts` | `.input()`/`.output()` schemas, `.route({ method, path })`, oRPC middleware, call services, throw `ORPCError` | Hold business logic beyond orchestration |
| Client | `src/clients/<resource>.client.ts`, barrel `src/clients/index.ts` | `queryOptions`/`mutationOptions` built from `orpc.<resource>.*`, plus the resource's `keys` | Write query keys by hand, `fetch` directly |
| Route / component | `src/routes/**`, `src/features/**`, `src/components/**` | `ensureQueryData`, `useSuspenseQuery`, `useQuery`, `useMutation` | Import services or `@/router/*` |

- `src/actions/<name>.functions.ts` sits beside the procedures for app-only server work (see Server primitives). Actions call services; they never re-implement a procedure.
- Query keys come from oRPC (`orpc.<resource>.key()`, `.queryKey({ input })`) — never literals.
- The `src/clients/` barrel exports `clients` (plural), because `client` is the raw oRPC client.

## Hard rules

- **Never hand-edit `src/routeTree.gen.ts`.**
- **Everything is isomorphic by default.** Loaders, `beforeLoad` and components run on the server during SSR and in the browser on navigation. Server-only work (database, secrets, file system) lives only behind a server boundary: an oRPC procedure, a `createServerFn`, a server route handler, `createServerOnlyFn`, or a `*.server.ts` file.
- **Never `fetch('/api/...')` from a loader** — there is no base URL during SSR. Call procedures through `orpc`.
- **Access control lives on the server.** Procedures, server functions and server routes are public HTTP endpoints; enforce auth inside them or in their middleware. `beforeLoad` redirects and hidden UI are UX, not a data boundary.
- **One `QueryClient` per request**, created by `getContext()` inside `getRouter()`. Never hoist or memoize it at module scope — on the server that leaks cached data between users.
- **The oRPC router is imported as `@/router/index`**, never `@/router` (that resolves to TanStack's `src/router.tsx`). Don't rename `src/router.tsx` — Start finds its router entry by that name.
- **Client-reachable code never value-imports `@/router/*` or `@/services/*`.** It goes through `client`/`orpc` from `@/integrations/orpc/client` — the only module allowed to reference the oRPC router, inside its `.server()` branch — or uses `import type`.
- **Expected failures in procedures throw `ORPCError`** with a code; anything else reaches the client as a generic `INTERNAL_SERVER_ERROR`.
- **Secrets never carry the `VITE_` prefix** (those values are inlined into the client bundle) and are read only inside a server boundary, at call time, never at module scope.
- **`src/start.ts` exports `startInstance`** (`createStart(...)`) — the generated route tree imports that name.
- **`import '@/polyfill'` stays the first line of every oRPC handler route.**
- **`src/components/ui/**` is built on `@base-ui/react`, not Radix**; composition uses the `render` prop, never `asChild`.
- **In an `errorComponent`, a retry button calls `router.invalidate()`**; `reset()` only clears the boundary without re-running the loader.
- **The React Compiler runs over the whole app.** Components and hooks follow the Rules of React; don't hand-add `useMemo`/`useCallback` for things it already handles.
- **Browser APIs (`window`, `document`, `localStorage`) only inside effects and event handlers**, or behind `<ClientOnly>` / `useHydrated()`.

## Path aliases

One alias: `@/*` → `./src/*`, from TypeScript `paths` in `tsconfig.json`, resolved at build time via `resolve: { tsconfigPaths: true }` in `vite.config.ts`. Use it for anything outside the current directory; relative imports are for siblings (e.g. `../styles.css?url` in `__root.tsx`).

Biome's import organizer groups imports in this order (see `assist.actions.source.organizeImports` in `biome.json`), each separated by a blank line: react → node builtins → `@tanstack/**` → other packages → `@/types/**` → `@/integrations/**` → `@/lib/**`/`@/hooks/**` → `@/schemas/**` → `@/services/**` → `@/clients/**` → `@/actions/**` → `@/components/**` → relative paths. The middle groups mirror the data layers above. Biome doesn't reorder across side-effect imports, so keep `import '@/polyfill'` on the first line.

## `misc/`

Gitignored scratch directory for notes and plans (the `commit-pr`, `commit-tasks` and `feature-plan` skills write there). It's outside Biome's `includes` and not part of the app — never import from it into `src/`.

## Naming conventions

Not enforced by a linter — follow them manually:

| Kind | Convention | Example |
| --- | --- | --- |
| Files | `kebab-case` | `user-profile.tsx`, `use-auth.ts` |
| Layer files | `<name>.<layer>.ts` | `todo.schema.ts`, `todo.server.ts`, `todo.client.ts`, `session.functions.ts` |
| Variables / functions | `camelCase` | `queryClient`, `getRouter()` |
| Classes / types / interfaces / React components | `PascalCase` | `QueryClient`, `ORPCError`, `RootDocument`, `type AppRouterContext` |
| Object keys | `snake_case` | `{ user_id: 1, created_at: '...' }` |

Exception: route files under `src/routes/` follow TanStack Router's file-based routing conventions (`__root.tsx`, `$param.tsx`, `api.$.ts`, `index.tsx`), and third-party config objects keep whatever key casing their API defines (e.g. `defaultPreloadStaleTime` in `createRouter`, `specGenerateOptions` in oRPC plugins). The `snake_case` rule applies to object keys we define ourselves — payloads, DTOs, config maps.

## Code style (enforced by Biome, `biome.json`)

- 4-space indent, single quotes (including JSX), semicolons always, 120-char line width
- Default lint rules turned off project-wide: `noExplicitAny`, `noArrayIndexKey`, `useExhaustiveDependencies`, `noUnusedVariables`, `noChildrenProp`, `noNestedComponentDefinitions`, `noComponentHookFactories`, `useUniqueElementIds`, `noDangerouslySetInnerHtml`, `useOptionalChain`, and several `a11y` rules
- `noUnusedImports` is escalated to `error`

TypeScript is strict (`tsconfig.json`): `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax` (type-only imports must use `import type`), `noUncheckedSideEffectImports`.

## Code comments

**Don't write comments that explain the code.** No narration of what a line does, no rationale for why it's written that way, no section headers, no JSDoc-style prose. The code speaks for itself — clearer naming and smaller functions are the fix, not a comment.

- Applies to new code and to any file you edit. Don't add an explanatory comment to code you're touching.
- Existing comments stay as they are — the scaffold's notes in `src/polyfill.ts` and `src/integrations/t3-oss/env.ts`, the JSDoc in `src/hooks/use-debounced-callback.ts`, and shadcn's comments in `src/components/ui/**`. Leave them alone unless the code they annotate is removed.
- Only exception: machine-read directives such as `biome-ignore` and `@ts-expect-error`.

## React imports

Always import React as a namespace:

```ts
import * as React from 'react';   // ✅
// then: React.useState, React.useEffect, React.ComponentProps

import { useState, useEffect } from 'react';   // ❌ never
```

## Detail per area (`.claude/rules/`)

Everything that describes how one area works today lives in a path-scoped file under `.claude/rules/`. Each loads by itself when a matching file is read; open it by hand when a task or a question is about that area without touching its files.

| File | Covers |
| --- | --- |
| `routing.md` | Vite plugin order and Start entries, `getRouter()` and router options, the root route and SSR shell, the route table, route-tree generation and the `generate-routes` caveat |
| `server.md` | The oRPC router and procedures, both transports, the isomorphic client, procedure context, errors, server functions, server routes, middleware and `src/start.ts` |
| `data-fetching.md` | `QueryClient` and SSR hydration, `src/clients/` (call convention, query keys, mutations), route wiring, adding a resource |
| `integrations.md` | `env.ts` and environment variables, the theme provider, devtools, TanStack Query/Router helpers, the TanStack Table hook (`useAppTable`) and TanStack Form hook (`useAppForm`) |
| `components.md` | `src/components/ui/**` (shadcn `base-nova` on Base UI), the Lexical rich text editor (`rich-text-editor/`, client-only), the ported `data-table/`, `coss-ui/`, `reui/` and `custom/` components, and Tailwind v4 styling |
| `lib-hooks.md` | `src/lib/**` helpers (including the rich text value helpers) and `src/hooks/**` |
| `features.md` | `src/features/**` page UI, including the `/components/*` preview pages for TanStack Table, Form and the rich text editor |

**Keeping them current.** When a change makes a description stale, update the rules file of that area — and its `paths` frontmatter when files move or a new folder belongs to it. A new area gets its own file and a row in this table. Edit `CLAUDE.md` only when a rule in this file changes; do not add descriptions of the current state of the code here.

## Skills

**TanStack skills come from Intent** (`AGENTS.md`), not from general knowledge. Before non-trivial changes to server functions, server routes, middleware, the execution model, deployment, router setup, data loading, search/path params, route guards, tables, or devtools, run `pnpm exec intent list` from the repo root, then `pnpm exec intent load <package>#<skill>` for whichever skill matches (e.g. `@tanstack/start-client-core#start-core/server-functions`, `@tanstack/start-client-core#start-core/middleware`, `@tanstack/react-router#compositions/router-query`, `@tanstack/router-core#router-core/data-loading`). Use the Intent installed in this repo — never `pnpm dlx`/`pnpx`; if it is unavailable, report the missing dependency. These skills ship inside the installed packages, so they match the installed versions.

Intent has no skills for TanStack Query or TanStack Form. For those two only, use the local copies in `.claude/skills/tanstack-query` and `.claude/skills/tanstack-form` — but skip the query skill's Next.js-style SSR section (`getServerSideProps`, `HydrationBoundary`); `setupRouterSsrQueryIntegration` handles SSR here. `.claude/skills/tanstack-start` describes the Vinxi era (`app.config.ts`, `app/`, `createAPIFileRoute`, `createMiddleware().handler()`); Intent's `start-core` skills supersede it wherever they differ. `.claude/skills/shadcn` stays local.
