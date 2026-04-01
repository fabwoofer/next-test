import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentItem, { formatDate } from './CommentItem';
import { Comment } from '@/lib/graphql/queries';

const baseComment: Comment = {
  id: 'c1',
  contents: 'This is a wonderful film.',
  user: { id: 'u1', name: 'Alice', avatar: '' },
  createdAt: '2024-06-15T10:00:00Z',
  likeNum: 3,
};

describe('CommentItem', () => {
  it('renders the comment text', () => {
    render(<CommentItem comment={baseComment} />);
    expect(screen.getByText('This is a wonderful film.')).toBeVisible();
  });

  it('renders the username', () => {
    render(<CommentItem comment={baseComment} />);
    expect(screen.getByText('Alice')).toBeVisible();
  });

  it('shows an avatar image when avatar URL is provided', () => {
    const withAvatar = {
      ...baseComment,
      user: { ...baseComment.user, avatar: 'https://example.com/avatar.jpg' },
    };
    render(<CommentItem comment={withAvatar} />);
    expect(screen.getByAltText('Alice')).toBeVisible();
  });

  it('shows initial letter when no avatar is provided', () => {
    render(<CommentItem comment={baseComment} />);
    expect(screen.getByText('A')).toBeVisible();
  });

  it('shows like count when > 0', () => {
    render(<CommentItem comment={baseComment} />);
    expect(screen.getByText(/♥ 3/)).toBeVisible();
  });

  it('hides like count when 0', () => {
    render(<CommentItem comment={{ ...baseComment, likeNum: 0 }} />);
    expect(screen.queryByText(/♥/)).not.toBeInTheDocument();
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to a readable date', () => {
    const result = formatDate('2024-06-15T10:00:00Z');
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/Jun/);
  });
});
