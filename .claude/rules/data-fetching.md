---
paths:
  - "src/schemas/**"
  - "src/clients/**"
  - "src/integrations/tanstack-query/**"
  - "src/integrations/orpc/**"
---

# Data fetching

## `QueryClient` and SSR

- `getContext()` (`src/integrations/tanstack-query/root-provider.tsx`) creates a new `QueryClient` per call, and `getRouter()` calls it per request, so each SSR request has its own cache.
- `setupRouterSsrQueryIntegration` (in `src/router.tsx`) dehydrates queries fetched during SSR, hydrates them in the browser, and wraps the app in `QueryClientProvider`. Don't add another provider.

## Clients (`src/clients/`)

- One file per resource, `src/clients/<resource>.client.ts`, built from the `orpc` utils of `src/integrations/orpc/client.ts`: `orpc.<resource>.<procedure>.queryOptions({ input })`, `.mutationOptions()`, `.queryKey({ input })`, and `orpc.<resource>.key()` for the whole resource.
- `src/clients/index.ts` is the barrel every consumer imports. It exports `clients` (plural — `client` is already the raw oRPC client): `clients.todos.index`.

**Call convention.** Queries without parameters are plain `queryOptions` objects; queries with parameters are functions returning one:

```ts
useQuery(clients.todos.index);     // object
useQuery(clients.todos.detail(1)); // function
```

**Query keys** come from oRPC, never literals: each client file exposes `keys` built from `orpc.<resource>.key()` (the whole resource) and `orpc.<resource>.<procedure>.queryKey({ input })` (one entry). Mutations use `orpc.<resource>.<procedure>.mutationOptions()` and invalidate through those keys on success.

## Route wiring

Routes that own their data prefetch it in a loader and read it with `useSuspenseQuery`, so `data` is always defined and no `= []` fallback is needed:

```ts
loader: ({ context }) => context.queryClient.ensureQueryData(clients.todos.index),
pendingComponent: ...,
errorComponent: ...,
```

The same loader runs on the server during SSR (in-process procedure call, dehydrated into the page) and in the browser on navigation (over `/api/rpc`). In an `errorComponent`, a retry button must call `router.invalidate()`; `reset()` only clears the boundary without re-running the loader.

## Adding a resource

Schema (`src/schemas/<name>.schema.ts`) → service (`src/services/<name>.server.ts`) → procedure (`src/router/<resource>.ts`, registered in `src/router/index.ts`) → client (`src/clients/<resource>.client.ts`, registered in `src/clients/index.ts`) → wire the route → `pnpm validate:full`. The first resource wired this way becomes the reference implementation; describe it here when it lands.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **No resource wired end to end yet:** `src/services/` and `src/clients/` don't exist, and `orpc` isn't consumed anywhere. `src/schemas/todo.schema.ts` only backs the demo router.
- **No `defaultOptions` on the `QueryClient`:** `staleTime` is 0, so data prefetched during SSR is refetched right after hydration unless the query sets a `staleTime`, and failed queries retry 3 times in the browser, 4xx `ORPCError`s included.
