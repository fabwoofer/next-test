import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommentsList from './CommentsList';
import { VideoComments } from '@/lib/graphql/queries';

const makeComment = (id: string, name: string, text: string) => ({
  id,
  contents: text,
  user: { id: `u${id}`, name, avatar: '' },
  createdAt: '2024-06-15T10:00:00Z',
  likeNum: Math.floor(Math.random() * 20),
});

const sampleData: VideoComments = {
  id: 'vc1',
  allCount: 42,
  pageInfo: {
    startCursor: 'c1',
    endCursor: 'c5',
    hasNextPage: true,
    hasPreviousPage: false,
  },
  edges: [
    {
      cursor: 'c1',
      node: makeComment('1', 'Alice', 'Beautifully crafted film, loved every moment.'),
    },
    {
      cursor: 'c2',
      node: makeComment('2', 'Bob', 'The direction and cinematography are top notch.'),
    },
    {
      cursor: 'c3',
      node: makeComment('3', 'Carol', 'A subtle masterpiece.'),
    },
    {
      cursor: 'c4',
      node: makeComment('4', 'Dave', 'Could not stop watching.'),
    },
    {
      cursor: 'c5',
      node: makeComment('5', 'Eve', 'Truly moving.'),
    },
  ],
};

function withQueryClient(Story: React.ComponentType) {
  const qc = new QueryClient();
  return (
    <QueryClientProvider client={qc}>
      <Story />
    </QueryClientProvider>
  );
}

const meta: Meta<typeof CommentsList> = {
  title: 'Components/CommentsList',
  component: CommentsList,
  parameters: { layout: 'padded' },
  decorators: [withQueryClient],
  args: {
    videoId: '1480',
    initialData: sampleData,
  },
};

export default meta;
type Story = StoryObj<typeof CommentsList>;

export const Default: Story = {};

export const NoMorePages: Story = {
  args: {
    initialData: {
      ...sampleData,
      pageInfo: { ...sampleData.pageInfo, hasNextPage: false },
    },
  },
};

export const Empty: Story = {
  args: {
    initialData: {
      ...sampleData,
      allCount: 0,
      edges: [],
      pageInfo: { ...sampleData.pageInfo, hasNextPage: false },
    },
  },
};
