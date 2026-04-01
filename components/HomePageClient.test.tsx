import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePageClient from './HomePageClient';
import { HomeScreenEntry, CategoryWithFilms } from '@/lib/graphql/queries';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// IntersectionObserver is not implemented in jsdom
const observeMock = vi.fn();
const disconnectMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = observeMock;
      disconnect = disconnectMock;
      constructor() {}
    },
  );
});

const allCategories: HomeScreenEntry[] = [
  { id: 'hs1', category: { id: 'cat1', name: 'Drama' } },
  { id: 'hs2', category: { id: 'cat2', name: 'Comedy' } },
];

const makeCategory = (id: string, name: string): CategoryWithFilms => ({
  id,
  name,
  videos: Array.from({ length: 6 }, (_, i) => ({
    id: `${id}-film-${i}`,
    title: `${name} Film ${i + 1}`,
    duration: { minutes: 10, seconds: 0 },
    landscapeThumbnail: 'https://example.com/thumb.jpg',
  })),
});

const initialBatchData: CategoryWithFilms[] = [
  makeCategory('cat1', 'Drama'),
  makeCategory('cat2', 'Comedy'),
];

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('HomePageClient', () => {
  it('renders a section for each initial category', () => {
    render(
      <HomePageClient
        allCategories={allCategories}
        initialBatchData={initialBatchData}
      />,
      { wrapper },
    );
    expect(screen.getAllByTestId('category-section')).toHaveLength(2);
  });

  it('renders category names', () => {
    render(
      <HomePageClient
        allCategories={allCategories}
        initialBatchData={initialBatchData}
      />,
      { wrapper },
    );
    expect(screen.getByText('Drama')).toBeVisible();
    expect(screen.getByText('Comedy')).toBeVisible();
  });

  it('renders film cards for each category', () => {
    render(
      <HomePageClient
        allCategories={allCategories}
        initialBatchData={initialBatchData}
      />,
      { wrapper },
    );
    // 2 categories × 6 films each
    expect(screen.getAllByTestId('film-card')).toHaveLength(12);
  });

  it('sets up an IntersectionObserver for infinite scroll', () => {
    render(
      <HomePageClient
        allCategories={allCategories}
        initialBatchData={initialBatchData}
      />,
      { wrapper },
    );
    expect(observeMock).toHaveBeenCalled();
  });
});
