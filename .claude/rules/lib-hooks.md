---
paths:
  - "src/lib/**"
  - "src/hooks/**"
---

# `src/lib/` and `src/hooks/`

## `src/lib/`

Framework-agnostic helpers — no React, no network calls:

- `utils.ts` — `cn()`, re-exported from the `cn` package (a compiled drop-in for clsx + tailwind-merge); `pending(delay = 2000)`, a promise that resolves after `delay` ms (simulated latency in the previews); `fallback(value, render?, empty = '—')` for empty table cells; `formatDate(value)` (`id-ID`, e.g. `30 Jun 2026`); `toDateValue(value)` (`YYYY-MM-DD`, used by the date fields and the date-range picker). The formatters are module-scope `Intl.DateTimeFormat` instances and use the runtime's time zone, so a server and a browser in different zones can format the same instant differently.
- `file.ts` — the file-picker logic behind `src/components/ui/input-file.tsx`: `pickFiles` (merges incoming files under `accept`/`multiple`/`maxFiles`/`maxSize`/`maxTotalSize` and returns `{ files, rejections }`), `validateFiles`, `matchesAccept`, `describeAccept`, `formatFileSize`, `formatFileType`, `getFileKind`, `isImageFile`, `getFileKey`, `getTotalSize`, `FILE_KINDS`, plus their types. Its user-facing messages are in Indonesian. Two browser-only helpers, called from event handlers by the rich text editor: `readFileAsDataUrl(file)` (`FileReader` → data URL) and `downloadFile(content, fileName, type)` (temporary `<a download>`).
- `rich-text.ts` — Lexical-free helpers over the rich text editor's value (a Lexical JSON string), safe on the server and in Zod schemas: `parseRichText` (→ `{ root }` or `null`), `getRichTextContent` (plain text, blocks joined by `\n\n` like Lexical's `getTextContent()`), `getRichTextLength` (the same count as the editor's character counter and `maxLength`), `isRichTextEmpty` (only whitespace text counts as empty; images, dividers, tables and lists don't).

## `src/hooks/`

- `useControllableState({ value, defaultValue, onChange })` → `[state, setState]`; controlled while `value !== undefined`.
- `useIsMobile()` → `true` below 768px. It returns `false` on the server and on the first client render, so mobile-only UI appears after hydration.
- `useBoolean(defaultValue)` → `{ value, setValue, setTrue, setFalse, toggle }`.
- `useCopyToClipboard({ timeout, onCopy })` → `{ isCopied, copyToClipboard }`, falling back to `document.execCommand('copy')`.
- `useDebouncedCallback(callback, delay)` → a stable debounced function that always calls the latest `callback`.

All browser access happens in effects or event handlers, so the hooks are SSR-safe.

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- Nothing known at the moment. Every hook has a caller: `useBoolean` (`InputPassword` in `tanstack-form/fields.tsx`), `useDebouncedCallback` (`components/data-table/search-input.tsx`, the editor's mention search), `useCopyToClipboard` (the editor's code-block copy button), `useControllableState` (`ui/input-file.tsx`, the editor's `ValuePlugin`).
