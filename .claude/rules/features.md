---
paths:
  - "src/features/**"
---

# Features (`src/features/`)

Page-level UI that a route renders, grouped as `src/features/<area>/<name>/<page>/*.tsx` (e.g. `components/data-table/index/`) with a `main.tsx` entry (the convention of the HRIS and tanstack-router-starter projects). It belongs to the route/component layer: it may use `@/integrations/**`, `@/lib/**`, `@/hooks/**`, `@/schemas/**`, `@/clients/**`, `@/actions/**` and `@/components/**`, never `@/services/**` or `@/router/*`.

## Preview pages (`src/features/components/`)

Live examples of the TanStack Table and TanStack Form integrations, rendered by `src/routes/components/*` (see `routing.md`). Everything runs on static data in the browser — no procedure, no client, no loader. Each page is an `ExamplePage` with one `ExampleSection` per case (`components/custom/example-section.tsx`), copy in Indonesian.

- `data-table/index/` — `constants.ts` (60 and 2000 generated tickets, badge variants), `columns.tsx` (one `createAppColumnHelper` with column sets per example), and one component per section: `basic.tsx` (client-side sorting + pagination), `filtering.tsx` (global search, faceted filters, date range, reset), `selection.tsx` (row selection + floating action bar), `states.tsx` (`isPending`/`isFetching`/`isError`/empty on `table.Content`), `skeleton.tsx` (`DataTableSkeleton`), `virtualization.tsx` (1000 rows per page with `virtual`, sticky select/actions columns). Every table calls `useTanStackTableDevtools(table)`.
- `form/index/` — `constants.ts` (options and limits), `schema.ts` (demo-only Zod schemas and default values — kept here because they are not API shapes, so they don't belong in `src/schemas/`), `submitted-value.tsx` (`JsonViewer` of the last submit), and one form per section: `text-fields.tsx`, `choice-fields.tsx`, `date-fields.tsx`, `file-fields.tsx`, `markdown-field.tsx` (viewer lazy-loaded), `validation.tsx` (field `onBlur` validator, simulated server error through `toFormErrorMap` for the email in `TAKEN_EMAIL`, live form state via `form.Subscribe`), `composition.tsx` (`withForm` + a `withFieldGroup` used for two nested addresses), `blocker.tsx` (`useFormBlocker` inline and inside `FormBlockerDialog`).

A new preview page gets its own `src/features/components/<name>/index/` folder, a route file in `src/routes/components/` with `staticData.breadcrumb`, and a card in `src/routes/components/index.tsx`.
