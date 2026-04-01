'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchVideoComments, queryKeys, VideoComments } from '@/lib/graphql/queries';
import CommentItem from './CommentItem';

interface CommentsListProps {
  videoId: string;
  initialData: VideoComments;
}

export default function CommentsList({ videoId, initialData }: CommentsListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKeys.videoComments(videoId),
      queryFn: ({ pageParam }) =>
        fetchVideoComments(videoId, 10, pageParam as string | undefined),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
      initialData: {
        pages: [initialData],
        pageParams: [undefined],
      },
    });

  const allComments = data.pages.flatMap((page) =>
    page.edges.map((e) => e.node),
  );
  const totalCount = data.pages[0].allCount;

  return (
    <div data-testid="comments-list">
      <h2 className="mb-2 text-lg font-semibold text-white">
        Comments{' '}
        <span className="text-sm font-normal text-gray-400">({totalCount})</span>
      </h2>

      {allComments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {allComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 w-full rounded-lg border border-gray-700 py-2 text-sm text-gray-300 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          data-testid="load-more-button"
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more comments'}
        </button>
      )}
    </div>
  );
}
