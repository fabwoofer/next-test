// GraphQL API endpoint. Explorer UI is available at /graphiql.
const GRAPHQL_URL = 'https://develop.api.samansa.com/graphql';

/**
 * Thin wrapper around Next.js `fetch` for GraphQL POST requests.
 *
 * Uses Next.js ISR caching via `next: { revalidate }`. The default of 3600 s
 * means each unique query+variables combination is cached for 1 hour at the
 * edge and regenerated in the background on the next request after expiry.
 *
 * This is the only function that should make network requests to the GraphQL
 * API. Client-side code calls the same fetch functions from queries.ts, which
 * delegate here — the browser ignores `next: { revalidate }` so it has no
 * effect outside of Next.js server-side rendering.
 */
export async function serverFetch<
  TData,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  query: string,
  variables?: TVariables,
  revalidate = 3600,
): Promise<TData> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data as TData;
}
