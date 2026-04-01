import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ThumbnailImage from './ThumbnailImage';

// ThumbnailImage uses next/image with fill, which requires a positioned parent.
// The decorator provides that container at a fixed aspect ratio.
function AspectWrapper(Story: React.ComponentType) {
  return (
    <div className="relative aspect-video w-80 overflow-hidden rounded-lg bg-gray-900">
      <Story />
    </div>
  );
}

const meta: Meta<typeof ThumbnailImage> = {
  title: 'Components/ThumbnailImage',
  component: ThumbnailImage,
  parameters: { layout: 'centered' },
  decorators: [AspectWrapper],
  args: {
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop',
    alt: 'Film thumbnail',
    sizes: '320px',
  },
};

export default meta;
type Story = StoryObj<typeof ThumbnailImage>;

export const Default: Story = {};

export const Priority: Story = {
  args: { priority: true },
};

export const BrokenSrc: Story = {
  args: { src: '/does-not-exist.jpg' },
};
