import { Comment } from '@/lib/graphql/queries';

interface CommentItemProps {
  comment: Comment;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export { formatDate };

export default function CommentItem({ comment }: CommentItemProps) {
  const { user, contents, createdAt, likeNum } = comment;
  const initial = user.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex gap-3 py-4" data-testid="comment-item">
      {user.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-gray-200">{user.name}</span>
          <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-300 leading-relaxed">{contents}</p>
        {likeNum > 0 && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
            ♥ {likeNum}
          </span>
        )}
      </div>
    </div>
  );
}
