---
paths:
  - "src/components/**"
  - "src/styles.css"
  - "components.json"
---

# Components and styling

## Components (`src/components/ui/`)

- shadcn/ui with the `base-nova` style (`components.json`: `baseColor: 'neutral'`, CSS variables). Primitives come from Base UI (`@base-ui/react`), so components compose through the `render` prop / `useRender` (e.g. `render={<Button variant='ghost' />}`), never Radix's `asChild`. Icons are `@tabler/icons-react`.
- Add or change components through the `shadcn` skill rather than by hand-copying; the aliases in `components.json` point at `@/components/ui`, `@/lib/utils` and `@/hooks`.
- `input-file.tsx` is built on `@/lib/file` (constraints, validation, Indonesian messages) and `useControllableState`; `sidebar.tsx` uses `useIsMobile`.
- Browser APIs stay inside effects and event handlers (e.g. the sidebar's keyboard shortcut), so the components render during SSR.

## Other component folders

Everything below was ported from the HRIS project together with the table/form integrations (see `integrations.md`). Edit these by hand — they are not shadcn registry components.

- `data-table/` — the pieces of TanStack Table v9 UI. `content.tsx` (`Content`, registered as `table.Content`: header + body with skeleton rows while `isPending`, dimmed body while `isFetching`, retry panel on `isError`, empty panel, and row virtualization via `@tanstack/react-virtual` once `virtual` is on and the rows pass `threshold`, default 50), `pagination.tsx` (`table.Pagination`, page-size `NativeSelect`), `row-count.tsx` (`table.RowCount`, uses `getRowCount()` so manual tables show the server total), `sort-button.tsx`, `selection-checkbox.tsx` (select-all + row checkbox with shift-click ranges), `row-selection.tsx` (floating action bar compound: `TableRowSelection`, `…Frame`, `…Content`, `…Label`, `…Actions`, `…Clear`), `search-input.tsx` (debounced `DataTableSearch`), `faceted-filter.tsx` (options from `column.getFacetedUniqueValues()`), `date-range-filter.tsx` (writes `[from, to]` into a column), `toolbar.tsx` (`DataTableToolbar`, `DataTableFilterReset`) and `styles.ts` (row/table class names shared with the skeletons). They read the table through `useTableContext` from `@/integrations/tanstack-table/contexts`, so they only work under `<table.AppTable>`.
- `coss-ui/` — `field.tsx` (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, … on Base UI's `Field`, used by every form field) and `checkbox-group.tsx`.
- `reui/icon-tile.tsx` — `IconTile` (`variant`, `size`, `radius`), used by `CheckboxCards`.
- `custom/`:
  - Table: `data-table.tsx` (`DataTableContainer`/`Header`/`Content`/`Footer` — a 3-row grid; pass `grid-rows-[1fr_auto]` and `border-t-0` on the content when there is no header), `skeleton.tsx` (`DataTableSkeleton` and its parts, for route `pendingComponent`s), `date-range-picker.tsx`.
  - Form: `file-upload.tsx` (`FileUpload.Root` dropzone with an image crop/resize editor on `react-image-crop`), `form-blocker.tsx` (`useFormBlocker(form)` blocks route navigation while the form is dirty via `useBlocker`; `FormBlockerAlertDialog` is the single confirmation dialog, mounted once in `__root.tsx`), `form-blocker-dialog.tsx` / `form-blocker-sheet.tsx` (`Dialog`/`Sheet` wrappers that intercept close-press, Escape and outside-press while a form inside is dirty), `markdown-editor/` (TipTap editor + read-only `MarkdownViewer`, both `immediatelyRender: false`; markdown in and out through `@tiptap/markdown`, KaTeX math, tables, images, YouTube embeds).
  - Preview shell: `page-header.tsx`, `route-breadcrumb.tsx` (breadcrumbs from `staticData.breadcrumb`), `example-section.tsx` (`ExamplePage`, `ExampleSection`), `app-navbar.tsx`, `theme-toggle.tsx`, and `json-viewer.tsx` (collapsible, searchable JSON tree).

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`, configured CSS-first in `src/styles.css` — there is no `tailwind.config.js`. That file is excluded from Biome.

- Imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the Geist/Outfit variable fonts, and loads `@plugin "@tailwindcss/typography"` (the `prose` classes of the markdown editor/viewer).
- Dark mode is class-based: `@custom-variant dark (&:is(.dark *))`, with oklch token sets under `:root` and `.dark`. The class comes from `ThemeProvider` (see `integrations.md`).
- Besides the shadcn tokens, `:root`/`.dark` define `--info`, `--success`, `--warning`, `--invert` and their `-foreground` pairs, mapped to `--color-*` in `@theme inline` — the `ui/badge.tsx` variants `info`, `success-light`, `warning-light` depend on them.
- `@layer components` at the end holds the `.markdown-editor*` / `.markdown-viewer__content` styles for `custom/markdown-editor/`.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Sidebar cookie:** `sidebar.tsx` stores its open state with `cookieStore.set({ expires: SIDEBAR_COOKIE_MAX_AGE })`. `expires` is an epoch timestamp in milliseconds, so the seconds value (`60 * 60 * 24 * 7`) writes a cookie that has already expired, and nothing reads `sidebar_state` during SSR to seed `defaultOpen`. No route renders the sidebar yet.
- **Peer mismatch:** `@tiptap/extension-mathematics@3.32` declares `katex` `^0.16 || ^0.17 || ^0.18` as a peer, but `katex@0.19` is installed (same as HRIS); `pnpm peers check` reports it.
- **English toolbar labels:** `custom/markdown-editor/toolbar.tsx` keeps the HRIS labels such as `'Bold'`, `'Heading 1'`, `'Bullet List'`.
