# Samansa Film Browser

A film browsing app built against the [Samansa GraphQL API](https://develop.api.samansa.com/graphiql). Three pages: home, category, and film detail.

## Pages

- **Home** — film thumbnails grouped by category; first 3 categories pre-fetched server-side, the rest loaded lazily on the client
- **Category** (`/category/[id]`) — full film grid for a single category
- **Film detail** (`/film/[id]`) — title, description, like count, and a comments sidebar

## Stack

| Technology          | Why                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 15**      | Server Components enable server-side GraphQL fetches with no client bundle cost; nested layouts simplify per-page structure                    |
| **TanStack Query**  | Handles client-side data fetching, caching, and deduplication for lazily-loaded category sections; integrates cleanly with SSR-prefetched data |
| **Native `fetch`**  | All GraphQL requests use Next.js's extended `fetch` with `next: { revalidate }` for built-in ISR caching — no extra GraphQL client needed      |
| **Tailwind CSS v4** | Utility-first styling with no runtime overhead                                                                                                 |
| **TypeScript**      | End-to-end type safety across GraphQL responses and component props                                                                            |
| **Vitest + RTL**    | Fast unit tests for components using jsdom; co-located `.test.tsx` files                                                                       |
| **Storybook 10**    | Isolated component development and visual testing; Storybook tests run via Vitest + Playwright in a real browser                               |

## Data flow

```
Browser request
  └─ Server Component (app/**/page.tsx)
       ├─ serverFetch() ──► Samansa GraphQL API
       │    └─ Next.js caches response (ISR, revalidates every 1 hour)
       └─ renders HTML, passes initialData to client components
            └─ Client Component ('use client')
                 └─ useInfiniteQuery(initialData)
                      ├─ first render: instant (no network, uses initialData)
                      └─ subsequent pages: serverFetch() called client-side
```

**Home page specifics:** the server fetches only category IDs first (`getHomeScreensCategories`), then pre-fetches films for the first 3 categories in parallel. Remaining categories are streamed in as the user scrolls, in batches of 3, using an IntersectionObserver sentinel.

## Project structure

```
app/                      # Next.js App Router pages (Server Components)
├── page.tsx              # Home — SSR category list + first 3 category films
├── category/[id]/page.tsx
├── film/[id]/page.tsx
└── providers.tsx         # TanStack Query context (client component)

components/               # Reusable UI components
├── HomePageClient.tsx    # Infinite-scroll category loader (client)
├── CommentsList.tsx      # Paginated comments with "Load more" (client)
├── FilmCard.tsx
├── FilmGrid.tsx
├── CategorySection.tsx
└── *.test.tsx / *.stories.tsx  # Co-located tests and stories

lib/graphql/
├── queries.ts            # Query strings, types, query keys, fetch functions
├── serverFetch.ts        # fetch() wrapper with ISR revalidation
└── query/*.graphql       # GraphQL operation definitions (used by codegen)
```

## Performance approach

The home page fetches **only category IDs and names** first (`getHomeScreensCategories`), then pre-fetches films for the first 3 categories server-side for a fast initial render. Remaining categories are fetched client-side as they are needed, using TanStack Query for caching and deduplication.

## Getting started

```bash
yarn dev       # development server at http://localhost:3000
yarn test      # unit tests (RTL)
yarn storybook # component explorer at http://localhost:6006
yarn build     # production build
yarn codegen   # regenerate GraphQL types after editing .graphql files
```
