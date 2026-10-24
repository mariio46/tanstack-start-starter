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

## Styling

Tailwind CSS v4 via `@tailwindcss/vite`, configured CSS-first in `src/styles.css` — there is no `tailwind.config.js`. That file is excluded from Biome.

- Imports `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, and the Geist/Outfit variable fonts.
- Dark mode is class-based: `@custom-variant dark (&:is(.dark *))`, with oklch token sets under `:root` and `.dark`. The class comes from `ThemeProvider` (see `integrations.md`).

## Known gaps and leftovers

Scaffold leftovers and half-finished work. **Do not assume these are intentional**, and don't spend time re-deriving them:

- **Sidebar cookie:** `sidebar.tsx` stores its open state with `cookieStore.set({ expires: SIDEBAR_COOKIE_MAX_AGE })`. `expires` is an epoch timestamp in milliseconds, so the seconds value (`60 * 60 * 24 * 7`) writes a cookie that has already expired, and nothing reads `sidebar_state` during SSR to seed `defaultOpen`. No route renders the sidebar yet.
