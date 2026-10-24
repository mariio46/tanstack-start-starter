---
paths:
  - "src/router/**"
  - "src/routes/api.*"
  - "src/routes/api/**"
  - "src/integrations/orpc/**"
  - "src/services/**"
  - "src/actions/**"
  - "src/start.ts"
  - "src/polyfill.ts"
---

# oRPC, server functions, server routes, middleware

## oRPC router (`src/router/`)

- **Name collision:** `src/router.tsx` is TanStack Router's factory; `src/router/` is the oRPC router. `@/router` resolves to the file, so the oRPC router is always imported as `@/router/index`.
- Procedures are built from `os` (`@orpc/server`): `os.input(zodSchema).route({ method, path }).handler(...)`. One file per resource exports `<resource>Router = { index, store, ... }`, aggregated in `src/router/index.ts` (`router = { todos: todoRouter }`).
- `src/router/todos.ts` is the scaffold's demo: an in-memory array behind `index` (`GET /users`) and `store` (`POST /users`).

## Transports

Two TanStack Start server routes expose the router over HTTP. Both start with `import '@/polyfill'` — a `File` polyfill for Node 18 (`src/polyfill.ts`), kept as the first line of any oRPC handler route — and answer `HEAD`/`GET`/`POST`/`PUT`/`PATCH`/`DELETE` through one `handle()` that falls back to `404 Not Found`:

- `src/routes/api.rpc.$.ts` — `RPCHandler`, prefix `/api/rpc`; what the browser client talks to.
- `src/routes/api.$.ts` — `OpenAPIHandler`, prefix `/api`; the REST surface derived from each procedure's `.route({ method, path })`. `SmartCoercionPlugin` coerces query/path strings to the Zod types; `OpenAPIReferencePlugin` serves Scalar docs at `GET /api` and the spec at `/api/spec.json` (title `'TanStack ORPC Playground'`), declaring a bearer-token security scheme with `'default-token'` prefilled in the docs UI.
- Only the OpenAPI handler has an `onError` interceptor (`console.error`). Keep interceptors and plugins in sync when adding them.

## Isomorphic client (`src/integrations/orpc/client.ts`)

One typed client built with `createIsomorphicFn()`:

- server: `createRouterClient(router, { context: () => ({ headers: getRequestHeaders() }) })` — procedures run in-process, no HTTP hop;
- browser: `RPCLink` to `${window.location.origin}/api/rpc`.

It exports `client` (`RouterClient<typeof router>`) and `orpc` (`createTanstackQueryUtils(client)`; its use is described in `data-fetching.md`). This file is the only client-reachable module allowed to import server code (`@/router/index`, `@tanstack/react-start/server`): both are used only inside the `.server()` branch, which the Start compiler strips from the client bundle.

## Import protection

Start's import protection keeps `*.server.*` files and `@tanstack/react-start/server` out of the client bundle: an import of either that survives the Start compiler in client code is mocked in dev and fails the production build. Type-only imports are ignored.

## Procedure context

The in-process client passes `{ headers }` as context, but both HTTP handlers call `handler.handle(request, { prefix: …, context: {} })`, and `os` declares no context. When a procedure first needs request data (auth, tenant), create one typed base — `os.$context<{ headers: Headers }>()` — that every procedure builds from, and pass `{ headers: request.headers }` from both handlers, so all three call paths supply the same context. oRPC middleware (`.use(...)`) on that base or on a procedure then runs on all three paths.

## Errors

Expected failures throw `new ORPCError('NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'BAD_REQUEST' | …, { message })`; the client receives an `ORPCError` with `code`/`status`, and the OpenAPI handler maps it to the HTTP status. Any other thrown value reaches the client as `INTERNAL_SERVER_ERROR` with the message replaced by `'Internal server error'`.

## Server functions (`src/actions/`)

- `createServerFn`s live in `src/actions/<name>.functions.ts`, which is safe to import anywhere. The server-only helpers they need live in `src/services/<name>.server.ts` and are called only inside `.handler()`, which the compiler strips from the client bundle.
- The installed Start names the input validator `.validator()` (on both `createServerFn` and `createMiddleware`), not `.inputValidator()`.
- Request utilities — `getRequest`, `getRequestHeader(s)`, `setResponseHeader(s)`, `setResponseStatus`, `getCookie`, `setCookie` — come from `@tanstack/react-start/server`.

## Server routes

- A server route adds `server: { handlers: { GET, POST, ... } }` to `createFileRoute(...)`; one file may define both `server` and `component`.
- `/api/$` is a catch-all owned by the OpenAPI handler. Static routes (e.g. `src/routes/api.webhooks.stripe.ts`) outrank the splat, so raw server routes can still live under `/api/...`.

## Middleware and `src/start.ts`

- `src/start.ts` doesn't exist yet. Create it as `export const startInstance = createStart(() => ({ requestMiddleware: [...], functionMiddleware: [...] }))`. Start picks the file up by name, and the generated route-tree footer imports `startInstance` to type the global middleware context.
- Request middleware: `createMiddleware().server(({ next, request }) => …)` — runs for SSR documents, server routes (both oRPC transports included) and server functions.
- Function middleware: `createMiddleware({ type: 'function' })` with `.client()`/`.server()` phases, attached per function with `.middleware([...])` or globally through `functionMiddleware`. TypeScript enforces the method order `middleware()` → `validator()` → `client()` → `server()`.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Context mismatch:** described under Procedure context; nothing reads the context yet.
- **Unlogged RPC errors:** `api.rpc.$.ts` has no `onError` interceptor, so errors from browser calls aren't logged.
- **Demo router:** `src/router/todos.ts` serves todos under `/users`, and its `index` handler returns the `safeParse` result object (`{ success, data }`) instead of the data. `.gitignore` still lists `todos.json` from the generator's file-based demo.
- **Not created yet:** `src/services/`, `src/actions/`, `src/start.ts`.
