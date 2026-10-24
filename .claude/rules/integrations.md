---
paths:
  - "src/integrations/**"
---

# Integrations

`src/integrations/` holds the wiring of third-party libraries: `orpc/` (see `server.md`), `t3-oss/`, `tanstack-form/`, `tanstack-query/`, `tanstack-router/`, `tanstack-table/`, `theme/`. The table and form integrations were ported from the HRIS project; their live examples are the `/components/*` preview pages (see `features.md`).

## Environment variables (`src/integrations/t3-oss/env.ts`)

- `createEnv` from `@t3-oss/env-core` declares `server: { SERVER_URL }` (optional URL) and `client: { VITE_APP_TITLE }` (required — set in `.env.local`), with `clientPrefix: 'VITE_'` and `emptyStringAsUndefined: true`. Import it as `@/integrations/t3-oss/env`.
- Start's Vite plugin copies every `.env*` variable into `process.env` during dev/build; production reads the real process environment. Vite exposes only `VITE_*` variables (plus its built-ins) through `import.meta.env`, and inlines them into the client bundle.
- Reading a `server` key from client code throws at runtime.

## Theme (`src/integrations/theme/provider.tsx`)

`ThemeProvider` (`theme: 'light' | 'dark' | 'system'`, persisted in `localStorage` under `storageKey`) renders a `ScriptOnce` that applies the stored or default theme as a class on `<html>` before hydration, then keeps it in sync, following `prefers-color-scheme` changes while the theme is `'system'`. `useTheme()` returns `{ theme, setTheme }`. The root route mounts it with `defaultTheme='light'`, `storageKey='theme'`.

## Devtools

`TanStackQueryDevtools` (`tanstack-query/devtools.tsx`), `TanStackRouterDevtools` (`tanstack-router/devtools.tsx`) and `TanStackFormDevtools` (`tanstack-form/devtools.tsx`) are `{ name, render }` panel objects; `TanStackTableDevtools` (`tanstack-table/devtools.tsx`) is the result of `tableDevtoolsPlugin()`. All four are passed to `<TanStackDevtools plugins={[...]}>` in `__root.tsx` (`position: 'bottom-right'`). A new panel follows the same shape and is appended to `plugins`. The table panel only lists tables that register themselves with `useTanStackTableDevtools(table)` from `@tanstack/react-table-devtools`.

## TanStack Table (`src/integrations/tanstack-table/`)

- `features.ts` — the one `tableFeatures({...})` set for every table, client-side or server-side: sorting (`alphanumeric`, `text`), pagination, column + global filtering, faceting (unique values), row selection, plus their row models. Filter fns: `includesString` (the global filter), `arrIncludesSome`, `inArray` (custom — cell value is one of the filter array; use it for faceted filters on scalar columns) and `inDateRange` (a `[from, to]` tuple; ISO strings are parsed). `columnMeta: metaHelper<DataTableColumnMeta>()` types `columnDef.meta` as `{ sticky?, align?, headerClassName?, cellClassName? }`, read by `components/data-table/content.tsx` for sticky/aligned cells (there is no `columnPinningFeature`).
- `contexts.ts` — `createTableHookContexts<typeof features>()`. Components registered in the hook import `useTableContext` from **this** file, not from `context.tsx`, to break the import cycle `context.tsx → components/data-table/* → contexts.ts`.
- `context.tsx` — the only `createTableHook`: exports `useAppTable`, `createAppColumnHelper`, `useTableContext`, `useCellContext`, `useHeaderContext`, with `globalFilterFn: 'includesString'` and `tableComponents: { Content, Pagination, RowCount }` (rendered as `table.Content`, etc. inside `<table.AppTable>`). Behaviour options (`manualPagination`/`manualSorting`/`manualFiltering`, `autoResetPageIndex`, `enableMultiSort`, `sortDescFirst`, …) deliberately have no default here — each `useAppTable` call states them, so manual (server) and automatic (client) tables share the hook.
- `column-presets.ts` — `selectionColumn` and `actionsColumn` (`id: 'actions'`), spread into `columnHelper.display({...})` to turn off filtering/sorting for non-data columns.
- Call-site convention: the component starts with `'use no memo'`, owns its state slices as atoms (`useCreateAtom` from `@tanstack/react-store`, passed through `atoms: { pagination, sorting, … }`), reads an atom elsewhere with `useSelector`, passes `getRowId` and stable `columns`/`data` (module-scope empty-array fallback), and uses `(state) => state` as the selector.

## TanStack Form (`src/integrations/tanstack-form/`)

- `context.tsx` — `createFormHookContexts()` + `createFormHook()`. Exports `useAppForm`, `withForm`, `withFieldGroup`, `useFieldContext`, `useFormContext`.
- `fields.tsx` — the registered `fieldComponents`, each wrapping `coss-ui/field` (`Field`/`FieldLabel`/`FieldError`, error = `field.state.meta.errors[0].message`) around a `ui/` control: `Input`, `InputPassword`, `InputNumber` (`number | undefined`, optional `prefix`), `InputGroup` (`addon`), `Textarea`, `RichTextEditor` (Lexical JSON string, `''` when empty; the editor is lazy-loaded inside `<ClientOnly>` with a `Skeleton` fallback sized by `className`, because it can't render on the server — validate it with `richTextSchema`), `Combobox` / `ComboboxMultiple` (`items` + `async: false`, or `async: true` with a `QueryStatus` and `disabled`; disabled while `items` is `undefined`), `Checkbox`, `CheckboxCards`, `CheckboxGroups`, `RadioCards`, `InputDate` (`YYYY-MM-DD`), `InputDateTime` (`YYYY-MM-DDTHH:mm`), `InputDateMultiple` (`string[]`), `InputFile` and `FileUpload` (`File[]`). Every field requires a `label`.
- `forms.tsx` — `formComponents`: `SubmitButton` (subscribes to `canSubmit`/`isSubmitting`/`isValidating`; defaults `'Simpan'` / `'Memproses...'`) and `AlertError` (shows the form-level message stored under `FORM_ERROR_KEY`). Both render inside `<form.AppForm>`.
- `utils.ts` — `FORM_ERROR_KEY` (`'root'`); `toFormErrorMap({ message, fields }, renderedFields?)` builds the `{ form, fields }` value for `formApi.setErrorMap({ onSubmit })` (messages for fields not in `renderedFields` are appended to the form-level message so they aren't lost); `toFieldErrors(issues)` and `setFieldErrors(form, fields)` for issue lists.
- Call-site convention: `formOptions({ validators: { onSubmit: zodSchema }, defaultValues })`, then `useAppForm({ ...options, onSubmit })`; the `<Form id>` (`ui/form.tsx`) `onSubmit` handler calls `preventDefault()`, `stopPropagation()` and `form.handleSubmit()`; fields render through `<form.AppField name>{(field) => <field.Input label='…' />}</form.AppField>`.
- Unsaved-changes guards live in `components/custom/form-blocker*.tsx` (see `components.md`).

## TanStack Query and Router helpers

- `tanstack-query/context.ts` — `AppRouterContext` (`{ queryClient: QueryClient }`), the router context type.
- `tanstack-query/root-provider.tsx` — `getContext()`, which builds that context with a new `QueryClient` (see `data-fetching.md`).
- `tanstack-router/utils.ts` — `meta({ title })`, the page-title helper (usage in `routing.md`).
- `tanstack-router/tanstack-react-router.ts` — augments `StaticDataRouteOption` with `breadcrumb?: string`, read by `components/custom/route-breadcrumb.tsx`.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Server env vars never reach `env`:** `runtimeEnv` is `import.meta.env`, so `env.SERVER_URL` (and any future server key) is always `undefined`, even when set. Until `runtimeEnv` is fixed, server code reads secrets from `process.env` inside a server boundary, at call time.
- **Stale README:** the T3Env section says `import { env } from "#/env"` and `src/env.mjs`; neither exists.
- **Named React imports:** `theme/provider.tsx` imports `createContext`, `useContext`, `useEffect` and `useState` by name, against the namespace rule — don't copy it.
- **Dead guard:** `useTheme()` throws when the context is `undefined`, but the context has a default value, so the guard never fires outside a provider.
- **Stub:** `tanstack-query/root-provider.tsx` also default-exports an empty `TanstackQueryProvider()`.
- **Unused utils:** `toFieldErrors` and `setFieldErrors` in `tanstack-form/utils.ts` have no caller yet.
