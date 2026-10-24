---
paths:
  - "src/integrations/**"
---

# Integrations

`src/integrations/` holds the wiring of third-party libraries: `orpc/` (see `server.md`), `t3-oss/`, `tanstack-query/`, `tanstack-router/`, `theme/`.

## Environment variables (`src/integrations/t3-oss/env.ts`)

- `createEnv` from `@t3-oss/env-core` declares `server: { SERVER_URL }` (optional URL) and `client: { VITE_APP_TITLE }` (required — set in `.env.local`), with `clientPrefix: 'VITE_'` and `emptyStringAsUndefined: true`. Import it as `@/integrations/t3-oss/env`.
- Start's Vite plugin copies every `.env*` variable into `process.env` during dev/build; production reads the real process environment. Vite exposes only `VITE_*` variables (plus its built-ins) through `import.meta.env`, and inlines them into the client bundle.
- Reading a `server` key from client code throws at runtime.

## Theme (`src/integrations/theme/provider.tsx`)

`ThemeProvider` (`theme: 'light' | 'dark' | 'system'`, persisted in `localStorage` under `storageKey`) renders a `ScriptOnce` that applies the stored or default theme as a class on `<html>` before hydration, then keeps it in sync, following `prefers-color-scheme` changes while the theme is `'system'`. `useTheme()` returns `{ theme, setTheme }`. The root route mounts it with `defaultTheme='light'`, `storageKey='theme'`.

## Devtools

`TanStackQueryDevtools` (`tanstack-query/devtools.tsx`) and `TanStackRouterDevtools` (`tanstack-router/devtools.tsx`) are `{ name, render }` panel objects passed to `<TanStackDevtools plugins={[...]}>` in `__root.tsx` (`position: 'bottom-right'`). A new panel follows the same shape and is appended to `plugins`.

## TanStack Query and Router helpers

- `tanstack-query/context.ts` — `AppRouterContext` (`{ queryClient: QueryClient }`), the router context type.
- `tanstack-query/root-provider.tsx` — `getContext()`, which builds that context with a new `QueryClient` (see `data-fetching.md`).
- `tanstack-router/utils.ts` — `meta({ title })`, the page-title helper (usage in `routing.md`).

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Server env vars never reach `env`:** `runtimeEnv` is `import.meta.env`, so `env.SERVER_URL` (and any future server key) is always `undefined`, even when set. Until `runtimeEnv` is fixed, server code reads secrets from `process.env` inside a server boundary, at call time.
- **Stale README:** the T3Env section says `import { env } from "#/env"` and `src/env.mjs`; neither exists.
- **Named React imports:** `theme/provider.tsx` imports `createContext`, `useContext`, `useEffect` and `useState` by name, against the namespace rule — don't copy it.
- **Dead guard:** `useTheme()` throws when the context is `undefined`, but the context has a default value, so the guard never fires outside a provider.
- **Stub:** `tanstack-query/root-provider.tsx` also default-exports an empty `TanstackQueryProvider()`.
- **Installed but not wired:** `@tanstack/react-form` and `@tanstack/react-table` have no integration folder or devtools panel yet.
