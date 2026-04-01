# CLAUDE.md — Samansa Film Browser

This file is read automatically by Claude Code at the start of every session.

## Project overview

Film browsing app against the Samansa GraphQL API. Three pages: home (films grouped by category), category detail (full grid), and film detail (with comments sidebar).

## Commands

```bash
yarn dev              # dev server at http://localhost:3000
yarn build            # production build
yarn test             # unit tests (Vitest + RTL, jsdom)
yarn test:watch       # unit tests in watch mode
yarn test:coverage    # unit tests with coverage report
yarn storybook        # component explorer at http://localhost:6006
yarn codegen          # regenerate TypeScript types from .graphql files
yarn lint             # ESLint
```

## Architecture

### Request lifecycle

```
Browser request
  └─ Next.js Server Component (app/**/page.tsx)
       ├─ serverFetch() → Samansa GraphQL API (ISR-cached, revalidates every 1h)
       └─ renders HTML with initialData prop passed to client components
            └─ Client Component ('use client')
                 └─ useInfiniteQuery(initialData) — no network request on first render
                      └─ serverFetch() — subsequent pages fetched client-side
```

### Server vs Client Component — the key decision

- **Server Component** (default, no directive): use for pages, layouts, and anything that only fetches data and renders HTML. No hooks, no event handlers, no browser APIs.
- **Client Component** (`'use client'`): use **only** when you need interactivity — event handlers, `useState`/`useEffect`, infinite scroll, browser APIs.

Current client components and why:
| File | Reason |
|---|---|
| `components/HomePageClient.tsx` | Infinite scroll via IntersectionObserver |
| `components/CommentsList.tsx` | "Load more" button, client-side pagination |
| `app/providers.tsx` | TanStack Query context (`useState`) |

### Data fetching

All GraphQL requests go through `lib/graphql/serverFetch.ts`, which wraps Next.js `fetch` with `next: { revalidate: 3600 }` for ISR caching. There is no Apollo Client or Urql — native fetch is sufficient.

**GraphQL API:** `https://develop.api.samansa.com/graphql`  
**GraphQL Explorer:** `https://develop.api.samansa.com/graphiql`

Query strings, TypeScript types, query key factories, and fetch functions all live together in `lib/graphql/queries.ts`.

### TanStack Query

Used only on the client. SSR-prefetched data is passed as `initialData` to `useInfiniteQuery` so the first render is instant (no loading state). Default stale time is 60 seconds (configured in `app/providers.tsx`). Query keys are defined in the `queryKeys` factory in `lib/graphql/queries.ts` — always use these, never inline strings.

## How to add a new page

1. Create `app/<route>/page.tsx` as an `async` Server Component.
2. Add to `lib/graphql/queries.ts`:
   - Raw GraphQL query string
   - TypeScript response type(s)
   - A `queryKeys.<name>` entry
   - An exported `fetch<Name>()` function
3. If the page needs interactivity, create `components/<PageName>Client.tsx` with `'use client'` and pass server-fetched data as `initialData`.

## How to add a new component

1. Create `components/<ComponentName>.tsx`
2. Create `components/<ComponentName>.test.tsx` — unit tests with RTL
3. Create `components/<ComponentName>.stories.tsx` — at least one Storybook story
4. Run `yarn test` to confirm green

## Testing conventions

- **Unit tests**: Vitest + React Testing Library in jsdom. Co-located at `components/*.test.tsx`.
- **Storybook tests**: Run in a real Playwright/Chromium browser (`yarn test --project storybook`).
- Define mock data inline in test files — no shared fixtures directory.
- Every component should have both a `.test.tsx` and a `.stories.tsx` file.

## Conventions

- TypeScript strict mode is on — avoid `any`.
- Tailwind CSS v4 for all styling — no CSS modules, no styled-components.
- All imports use the `@/` path alias (maps to the repo root).
- File names: PascalCase for components (`FilmCard.tsx`), camelCase for utilities (`serverFetch.ts`).
- No Apollo Client, no Urql — GraphQL is fetched via `serverFetch()` only.
