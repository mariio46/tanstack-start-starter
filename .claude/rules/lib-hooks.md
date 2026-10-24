---
paths:
  - "src/lib/**"
  - "src/hooks/**"
---

# `src/lib/` and `src/hooks/`

## `src/lib/`

Framework-agnostic helpers — no React, no network calls:

- `utils.ts` — `cn()`, re-exported from the `cn` package (a compiled drop-in for clsx + tailwind-merge); `fallback(value, render?, empty = '—')` for empty table cells; `formatDate(value)` (`id-ID`, e.g. `30 Jun 2026`); `toDateValue(value)` (`YYYY-MM-DD`, used by the date fields and the date-range picker). The formatters are module-scope `Intl.DateTimeFormat` instances and use the runtime's time zone, so a server and a browser in different zones can format the same instant differently.
- `file.ts` — the file-picker logic behind `src/components/ui/input-file.tsx`: `pickFiles` (merges incoming files under `accept`/`multiple`/`maxFiles`/`maxSize`/`maxTotalSize` and returns `{ files, rejections }`), `validateFiles`, `matchesAccept`, `describeAccept`, `formatFileSize`, `formatFileType`, `getFileKind`, `isImageFile`, `getFileKey`, `getTotalSize`, `FILE_KINDS`, plus their types. Its user-facing messages are in Indonesian.

## `src/hooks/`

- `useControllableState({ value, defaultValue, onChange })` → `[state, setState]`; controlled while `value !== undefined`.
- `useIsMobile()` → `true` below 768px. It returns `false` on the server and on the first client render, so mobile-only UI appears after hydration.
- `useBoolean(defaultValue)` → `{ value, setValue, setTrue, setFalse, toggle }`.
- `useCopyToClipboard({ timeout, onCopy })` → `{ isCopied, copyToClipboard }`, falling back to `document.execCommand('copy')`.
- `useDebouncedCallback(callback, delay)` → a stable debounced function that always calls the latest `callback`.

All browser access happens in effects or event handlers, so the hooks are SSR-safe.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Built but unused:** `useCopyToClipboard`. (`useBoolean` backs `InputPassword` in `tanstack-form/fields.tsx`; `useDebouncedCallback` backs `components/data-table/search-input.tsx`.)
