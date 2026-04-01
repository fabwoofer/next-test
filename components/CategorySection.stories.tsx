import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CategorySection from './CategorySection';

const meta: Meta<typeof CategorySection> = {
  title: 'Components/CategorySection',
  component: CategorySection,
  parameters: { layout: 'padded' },
  args: {
    categoryId: '2',
    categoryName: 'Drama',
  },
};

export default meta;
type Story = StoryObj<typeof CategorySection>;

export const Default: Story = {
  args: {
    children: <p className="text-gray-400">Film grid would appear here</p>,
  },
};

export const LongCategoryName: Story = {
  args: {
    categoryName: 'Independent Short Films from Around the World',
    children: <p className="text-gray-400">Film grid would appear here</p>,
  },
};
