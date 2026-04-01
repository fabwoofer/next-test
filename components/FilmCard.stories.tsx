import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FilmCard from './FilmCard';

const meta: Meta<typeof FilmCard> = {
  title: 'Components/FilmCard',
  component: FilmCard,
  parameters: { layout: 'padded' },
  args: {
    id: '1480',
    title: 'A Quiet Place in the Universe',
    duration: { minutes: 14, seconds: 37 },
    landscapeThumbnail:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop',
  },
};

export default meta;
type Story = StoryObj<typeof FilmCard>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    title:
      'This Film Has an Exceptionally Long Title That Should Be Clamped to Two Lines Maximum',
  },
};

export const ShortDuration: Story = {
  args: {
    duration: { minutes: 2, seconds: 5 },
  },
};
