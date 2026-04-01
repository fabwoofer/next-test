import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CommentItem from './CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CommentItem',
  component: CommentItem,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {
  args: {
    comment: {
      id: 'c1',
      contents: 'This film really moved me. A masterpiece of storytelling.',
      user: { id: 'u1', name: 'Alice', avatar: '' },
      createdAt: '2024-06-15T10:00:00Z',
      likeNum: 12,
    },
  },
};

export const WithAvatar: Story = {
  args: {
    comment: {
      id: 'c2',
      contents: 'The cinematography is absolutely breathtaking.',
      user: {
        id: 'u2',
        name: 'Bob',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop',
      },
      createdAt: '2024-05-01T08:30:00Z',
      likeNum: 5,
    },
  },
};

export const NoLikes: Story = {
  args: {
    comment: {
      id: 'c3',
      contents: 'Interesting perspective.',
      user: { id: 'u3', name: 'Carol', avatar: '' },
      createdAt: '2024-07-20T14:00:00Z',
      likeNum: 0,
    },
  },
};
