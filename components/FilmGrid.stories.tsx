import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FilmGrid from './FilmGrid';

const sampleFilms = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  title: `Sample Film Title ${i + 1}`,
  duration: { minutes: 10 + i, seconds: (i * 7) % 60 },
  landscapeThumbnail: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop&sig=${i}`,
}));

const meta: Meta<typeof FilmGrid> = {
  title: 'Components/FilmGrid',
  component: FilmGrid,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FilmGrid>;

export const Default: Story = {
  args: { films: sampleFilms },
};

export const SingleFilm: Story = {
  args: { films: sampleFilms.slice(0, 1) },
};

export const Empty: Story = {
  args: { films: [] },
};
