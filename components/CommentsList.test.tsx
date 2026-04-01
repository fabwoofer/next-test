import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommentsList from './CommentsList';
import { VideoComments } from '@/lib/graphql/queries';
import { fetchVideoComments } from '@/lib/graphql/queries';

vi.mock('@/lib/graphql/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/graphql/queries')>();
  return {
    ...actual,
    fetchVideoComments: vi.fn(),
    queryKeys: { videoComments: (id: string) => ['videoComments', id] },
  };
});

const makeComment = (id: string) => ({
  id,
  contents: `Comment ${id}`,
  user: { id: `u${id}`, name: `User ${id}`, avatar: '' },
  createdAt: '2024-01-01T00:00:00Z',
  likeNum: 0,
});

const initialData: VideoComments = {
  id: 'vc1',
  allCount: 15,
  pageInfo: {
    startCursor: 'c1',
    endCursor: 'c10',
    hasNextPage: true,
    hasPreviousPage: false,
  },
  edges: Array.from({ length: 10 }, (_, i) => ({
    cursor: `c${i + 1}`,
    node: makeComment(String(i + 1)),
  })),
};

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Prevent automatic background refetches from consuming mock values
        staleTime: Infinity,
      },
    },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('CommentsList', () => {
  beforeEach(() => {
    vi.mocked(fetchVideoComments).mockReset();
  });

  it('renders initial comments', () => {
    render(<CommentsList videoId="1" initialData={initialData} />, { wrapper });
    expect(screen.getAllByTestId('comment-item')).toHaveLength(10);
  });

  it('shows the total comment count', () => {
    render(<CommentsList videoId="1" initialData={initialData} />, { wrapper });
    expect(screen.getByText('(15)')).toBeVisible();
  });

  it('shows the "Load more" button when hasNextPage is true', () => {
    render(<CommentsList videoId="1" initialData={initialData} />, { wrapper });
    expect(screen.getByTestId('load-more-button')).toBeVisible();
  });

  it('hides the "Load more" button when there is no next page', () => {
    const noNextPage: VideoComments = {
      ...initialData,
      pageInfo: { ...initialData.pageInfo, hasNextPage: false },
    };
    render(<CommentsList videoId="1" initialData={noNextPage} />, { wrapper });
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
  });

  it('loads more comments when button is clicked', async () => {
    const nextPage: VideoComments = {
      id: 'vc1',
      allCount: 15,
      pageInfo: {
        startCursor: 'c11',
        endCursor: 'c15',
        hasNextPage: false,
        hasPreviousPage: true,
      },
      edges: Array.from({ length: 5 }, (_, i) => ({
        cursor: `c${i + 11}`,
        node: makeComment(String(i + 11)),
      })),
    };
    vi.mocked(fetchVideoComments).mockResolvedValueOnce(nextPage);

    render(<CommentsList videoId="1" initialData={initialData} />, { wrapper });
    fireEvent.click(screen.getByTestId('load-more-button'));

    await waitFor(() =>
      expect(screen.getAllByTestId('comment-item')).toHaveLength(15),
    );
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
  });

  it('shows "No comments yet." when comment list is empty', () => {
    const empty: VideoComments = {
      ...initialData,
      allCount: 0,
      edges: [],
      pageInfo: { ...initialData.pageInfo, hasNextPage: false },
    };
    render(<CommentsList videoId="1" initialData={empty} />, { wrapper });
    expect(screen.getByText('No comments yet.')).toBeVisible();
  });
});
